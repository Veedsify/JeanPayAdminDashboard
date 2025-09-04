// Admin Rates Types
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
}

export interface ExchangeRate {
  id: number;
  from_currency: string;
  to_currency: string;
  rate: number;
  source: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RateHistory {
  id: number;
  from_currency: string;
  to_currency: string;
  rate: number;
  source: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  change_from_previous?: number;
  change_percentage?: number;
}

export interface CreateRateRequest {
  from_currency: string;
  to_currency: string;
  rate: number;
  source: string;
}

export interface UpdateRateRequest {
  rate?: number;
  source?: string;
  active?: boolean | null;
}

export interface RateQueryParams {
  from_currency?: string;
  to_currency?: string;
  source?: string;
  active?: boolean;
  cursor?: number;
  limit?: number;
  search?: string;
  from_date?: string;
  to_date?: string;
}

export interface RateFilter {
  fromCurrency?: string;
  toCurrency?: string;
  source?: string;
  active?: boolean;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface RateHistoryResponse {
  rates: RateHistory[];
  pagination: PaginationInfo;
}

// Rate Comparison
export interface RateComparison {
  from_currency: string;
  to_currency: string;
  rates: RateComparisonItem[];
  best_rate: RateComparisonItem;
  timestamp: string;
}

export interface RateComparisonItem {
  source: string;
  rate: number;
  last_updated: string;
  is_active: boolean;
  spread?: number;
  markup?: number;
}

// Current Rate
export interface CurrentRate {
  from_currency: string;
  to_currency: string;
  rate: number;
  source: string;
  last_updated: string;
  is_active: boolean;
}

// Rate Analytics
export interface RateAnalytics {
  currency_pairs: CurrencyPairStats[];
  rate_trends: RateTrend[];
  source_performance: SourcePerformance[];
  volatility_analysis: VolatilityAnalysis[];
}

export interface CurrencyPairStats {
  from_currency: string;
  to_currency: string;
  current_rate: number;
  avg_rate_24h: number;
  high_rate_24h: number;
  low_rate_24h: number;
  change_24h: number;
  change_percentage_24h: number;
  volume_24h: number;
  last_updated: string;
}

export interface RateTrend {
  date: string;
  from_currency: string;
  to_currency: string;
  open_rate: number;
  close_rate: number;
  high_rate: number;
  low_rate: number;
  avg_rate: number;
  volume: number;
}

export interface SourcePerformance {
  source: string;
  total_rates: number;
  active_rates: number;
  last_update: string;
  update_frequency: number;
  reliability_score: number;
  accuracy_score: number;
}

export interface VolatilityAnalysis {
  from_currency: string;
  to_currency: string;
  volatility_score: number;
  standard_deviation: number;
  coefficient_of_variation: number;
  period_analyzed: string;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
}

// Rate History Extended
export interface RateHistoryExtended {
  from_currency: string;
  to_currency: string;
  source: string;
  interval: "hourly" | "daily" | "weekly" | "monthly";
  history: RateHistoryItem[];
}

export interface RateHistoryItem {
  date: string;
  rate: number;
  high_rate: number;
  low_rate: number;
  avg_rate: number;
  change_pct: number;
  change_value: number;
  volume?: number;
}

// Rate Alerts
export interface RateAlert {
  id: number;
  from_currency: string;
  to_currency: string;
  threshold_rate: number;
  condition: "ABOVE" | "BELOW" | "EQUALS";
  is_active: boolean;
  triggered_at?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface CreateRateAlertRequest {
  from_currency: string;
  to_currency: string;
  threshold_rate: number;
  condition: "ABOVE" | "BELOW" | "EQUALS";
}

// Rate Management Actions
export interface AdminActionResponse {
  success: boolean;
  message: string;
  timestamp: string;
  actionedBy?: number;
}

export interface BulkRateAction {
  action: "activate" | "deactivate" | "delete" | "update_source";
  rateIds: number[];
  data?: any;
}

export interface BulkActionResponse {
  success: boolean;
  message: string;
  processed: number;
  failed: number;
  errors: Array<{
    rateId: number;
    error: string;
  }>;
}

// API Response Types
export interface RatesApiResponse {
  error: boolean;
  message: string;
  nextCursor?: number;
  data: ExchangeRate[];
}

export interface RateHistoryApiResponse {
  error: boolean;
  message: string;
  data: RateHistoryResponse;
}

export interface CurrentRateApiResponse {
  error: boolean;
  message: string;
  data: CurrentRate;
}

export interface RateComparisonApiResponse {
  error: boolean;
  message: string;
  data: RateComparison;
}

export interface RateAnalyticsApiResponse {
  error: boolean;
  message: string;
  data: RateAnalytics;
}

export interface RateActionApiResponse {
  error: boolean;
  message: string;
  data: AdminActionResponse;
}

export interface RateAlertsApiResponse {
  error: boolean;
  message: string;
  data: RateAlert[];
}

// Rate Configuration
export interface RateConfiguration {
  auto_update_enabled: boolean;
  update_frequency_minutes: number;
  default_source: string;
  fallback_sources: string[];
  rate_tolerance_percentage: number;
  max_rate_age_hours: number;
  require_admin_approval: boolean;
}
