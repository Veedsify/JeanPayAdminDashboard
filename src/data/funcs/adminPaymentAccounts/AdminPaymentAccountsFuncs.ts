import axiosClient from "@/lib/axios";

export interface PaymentAccount {
  ID: number;
  currency: string;
  account_type: "bank" | "momo";
  account_name: string;
  account_number?: string;
  bank_name?: string;
  bank_code?: string;
  phone_number?: string;
  network?: string;
  is_active: boolean;
  created_by: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentAccountsQueryParams {
  currency?: string;
  account_type?: string;
  is_active?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  cursor?: number;
}

export interface CreatePaymentAccountRequest {
  currency: string;
  account_type: "bank" | "momo";
  account_name: string;
  account_number?: string;
  bank_name?: string;
  bank_code?: string;
  phone_number?: string;
  network?: string;
  notes?: string;
}

export interface UpdatePaymentAccountRequest {
  currency?: string;
  account_type?: "bank" | "momo";
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  bank_code?: string;
  phone_number?: string;
  network?: string;
  notes?: string;
  is_active?: boolean;
}

export interface PaymentAccountsApiResponse {
  error: boolean;
  message: string;
  data: PaymentAccount[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  nextCursor?: number;
}

export interface PaymentAccountApiResponse {
  error: boolean;
  message: string;
  data: PaymentAccount;
}

export interface ActivePaymentAccountsApiResponse {
  error: boolean;
  message: string;
  data: PaymentAccount[];
}

// Get all payment accounts with pagination and filters
async function getAllPaymentAccounts(
  params?: PaymentAccountsQueryParams,
): Promise<PaymentAccountsApiResponse> {
  const requestData = {
    currency: params?.currency || "",
    account_type: params?.account_type || "",
    is_active: params?.is_active,
    search: params?.search || "",
    page: params?.page || 1,
    limit: params?.limit || 10,
  };

  const response = await axiosClient.post(
    "/admin/payment-accounts/all",
    requestData,
  );

  // Add cursor for infinite scrolling if needed
  if (params?.cursor !== undefined) {
    response.data.nextCursor =
      response.data.pagination.page < response.data.pagination.total_pages
        ? response.data.pagination.page + 1
        : undefined;
  }

  return response.data;
}

// Create new payment account
async function createPaymentAccount(
  request: CreatePaymentAccountRequest,
): Promise<PaymentAccountApiResponse> {
  const response = await axiosClient.post(
    "/admin/payment-accounts/create",
    request,
  );
  return response.data;
}

// Update existing payment account
async function updatePaymentAccount(
  accountId: number,
  request: UpdatePaymentAccountRequest,
): Promise<PaymentAccountApiResponse> {
  const response = await axiosClient.patch(
    `/admin/payment-accounts/${accountId}`,
    request,
  );
  return response.data;
}

// Delete payment account
async function deletePaymentAccount(
  accountId: number,
): Promise<{ error: boolean; message: string }> {
  const response = await axiosClient.delete(
    `/admin/payment-accounts/${accountId}`,
  );
  return response.data;
}

// Toggle payment account status
async function togglePaymentAccountStatus(
  accountId: number,
): Promise<PaymentAccountApiResponse> {
  const response = await axiosClient.patch(
    `/admin/payment-accounts/${accountId}/toggle`,
  );
  return response.data;
}

// Get payment account by ID
async function getPaymentAccountById(
  accountId: number,
): Promise<PaymentAccountApiResponse> {
  const response = await axiosClient.get(
    `/admin/payment-accounts/${accountId}`,
  );
  return response.data;
}

// Get active payment accounts (for admin and public use)
async function getActivePaymentAccounts(
  currency?: string,
  accountType?: string,
): Promise<ActivePaymentAccountsApiResponse> {
  const params = new URLSearchParams();
  if (currency) params.append("currency", currency);
  if (accountType) params.append("account_type", accountType);

  const response = await axiosClient.get(
    `/admin/payment-accounts/active?${params.toString()}`,
  );
  return response.data;
}

export {
  getAllPaymentAccounts,
  createPaymentAccount,
  updatePaymentAccount,
  deletePaymentAccount,
  togglePaymentAccountStatus,
  getPaymentAccountById,
  getActivePaymentAccounts,
};
