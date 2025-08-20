import axiosClient from "@/lib/axios";
import {
  RatesApiResponse,
  RateHistoryApiResponse,
  CurrentRateApiResponse,
  RateActionApiResponse,
  RateQueryParams,
  CreateRateRequest,
  UpdateRateRequest,
} from "@/types/admin-rates";

// Get all exchange rates with pagination and filters
async function getAllRates(params?: RateQueryParams): Promise<RatesApiResponse> {
  const response = await axiosClient.get("/admin/rates/history", { params });
  return response.data;
}

// Get rate history
async function getRateHistory(params?: RateQueryParams): Promise<RateHistoryApiResponse> {
  return axiosClient.get("/admin/rates/history", { params });
}

// Add new exchange rate
async function addRate(request: CreateRateRequest): Promise<RateActionApiResponse> {
  const response = await axiosClient.post("/admin/rates/add", request);
  return response.data;
}

// Update existing exchange rate
async function updateRate(rateId: number, request: UpdateRateRequest): Promise<RateActionApiResponse> {
  return axiosClient.patch(`/admin/rates/update/${rateId}`, request);
}

// Delete exchange rate
async function deleteRate(rateId: number): Promise<RateActionApiResponse> {
  return axiosClient.delete(`/admin/rates/delete/${rateId}`);
}

// Get current rate for currency pair
async function getCurrentRate(fromCurrency: string, toCurrency: string): Promise<CurrentRateApiResponse> {
  return axiosClient.get(`/admin/rates/current/${fromCurrency}/${toCurrency}`);
}


export {
  getAllRates,
  getRateHistory,
  addRate,
  updateRate,
  deleteRate,
  getCurrentRate,
};
