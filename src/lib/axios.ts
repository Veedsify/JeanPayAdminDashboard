import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// Queue to store failed requests while refreshing token
interface FailedRequest {
  resolve: (value: AxiosResponse | Promise<AxiosResponse>) => void;
  reject: (error: AxiosError) => void;
  config: InternalAxiosRequestConfig;
}

// Extend InternalAxiosRequestConfig to include our custom retry flag
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

class AxiosAuthManager {
  private isRefreshing = false;
  private failedQueue: FailedRequest[] = [];

  private processQueue(error: AxiosError | null = null): void {
    this.failedQueue.forEach(({ resolve, reject, config }) => {
      if (error) {
        reject(error);
      } else {
        resolve(axiosClient(config));
      }
    });

    this.failedQueue = [];
  }

  private addToQueue(
    config: InternalAxiosRequestConfig,
  ): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      this.failedQueue.push({ resolve, reject, config });
    });
  }

  async refreshToken(): Promise<boolean> {
    try {
      // Use a separate axios instance for refresh to avoid interceptor loops
      const refreshAxios = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        withCredentials: true,
      });

      await refreshAxios.post("/auth/refresh-token");
      return true;
    } catch {
      return false;
    }
  }

  async handleTokenRefresh(
    originalRequest: InternalAxiosRequestConfig,
  ): Promise<AxiosResponse> {
    // If already refreshing, add to queue
    if (this.isRefreshing) {
      return this.addToQueue(originalRequest);
    }

    this.isRefreshing = true;

    try {
      const refreshSuccess = await this.refreshToken();

      if (refreshSuccess) {
        this.processQueue();
        return axiosClient(originalRequest);
      } else {
        const refreshError = new Error("Token refresh failed") as AxiosError;
        this.processQueue(refreshError);
        // Redirect to login - we'll emit an event that the auth context can listen to
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:logout"));
        }
        throw refreshError;
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      this.processQueue(axiosError);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:logout"));
      }
      throw axiosError;
    } finally {
      this.isRefreshing = false;
    }
  }
}

const authManager = new AxiosAuthManager();

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add any additional headers or modifications here
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    // Check if error is 401 and we haven't already tried to refresh
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh-token") &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      originalRequest._retry = true;

      try {
        return await authManager.handleTokenRefresh(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // For other errors or if refresh failed, reject the promise
    return Promise.reject(error);
  },
);

export default axiosClient;
export { authManager };
