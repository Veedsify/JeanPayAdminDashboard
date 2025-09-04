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
async function getAllRates(
  params?: RateQueryParams,
): Promise<RatesApiResponse> {
  const response = await axiosClient.get("/admin/rates/history", { params });
  return response.data;
}

// Get rate history
async function getRateHistory(
  params?: RateQueryParams,
): Promise<RateHistoryApiResponse> {
  return axiosClient.get("/admin/rates/history", { params });
}

// Add new exchange rate
async function addRate(
  request: CreateRateRequest,
): Promise<RateActionApiResponse> {
  const response = await axiosClient.post("/admin/rates/add", request);
  return response.data;
}

// Update existing exchange rate
async function updateRate(
  rateId: number,
  request: UpdateRateRequest,
): Promise<RateActionApiResponse> {
  const response = await axiosClient.patch(`/admin/rates/${rateId}`, request);
  return response.data;
}

// Delete exchange rate
async function deleteRate(rateId: number): Promise<RateActionApiResponse> {
  const response = await axiosClient.delete(`/admin/rates/${rateId}`);
  return response.data;
}

// Toggle rate status
async function toggleRateStatus(
  rateId: number,
  active: boolean,
): Promise<RateActionApiResponse> {
  const response = await axiosClient.patch(`/admin/rates/${rateId}/toggle`, {
    active,
  });
  return response.data;
}

// Get current rate for currency pair
async function getCurrentRate(
  fromCurrency: string,
  toCurrency: string,
): Promise<CurrentRateApiResponse> {
  return axiosClient.get(`/admin/rates/current/${fromCurrency}/${toCurrency}`);
}

export {
  getAllRates,
  getRateHistory,
  addRate,
  updateRate,
  deleteRate,
  toggleRateStatus,
  getCurrentRate,
};
