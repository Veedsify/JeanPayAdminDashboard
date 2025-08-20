"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpDown,
  CheckCircle2,
  MinusCircle,
  MoreHorizontal,
  Plus,
  Search,
  X,
  Loader2,
} from "lucide-react";
import { useMemo, useState, useCallback } from "react";
import { debounce } from "lodash";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn, formatDateTime, GetCurrencySymbol } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { ExchangeRate } from "@/types/admin-rates";
import useAdminRates, {
  useRatesInfiniteQuery,
} from "@/data/hooks/AdminRatesHook";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { Checkbox } from "@/components/ui/Checkbox";
import { SelectBox } from "@/components/ui/Select";

// Input component
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

// Status badge component
const StatusBadge = React.memo(
  ({ status }: { status: "Active" | "Inactive" | "Pending" }) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold";

    const statusConfig = {
      Active: {
        className: "bg-[#E9F8EE] text-[#147D3B]",
        icon: CheckCircle2,
      },
      Inactive: {
        className: "bg-[#F0F2F5] text-[#5A6474]",
        icon: MinusCircle,
      },
      Pending: {
        className: "bg-[#F0F2F5] text-[#5A6474]",
        icon: MoreHorizontal,
      },
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <div className={`${baseClasses} ${config.className}`}>
        <IconComponent className="w-4 h-4 mr-1.5" />
        {status}
      </div>
    );
  }
);
StatusBadge.displayName = "StatusBadge";

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex space-x-4">
        <div className="h-4 w-4 bg-gray-300 rounded"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

// Empty state component
const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="text-gray-400 mb-4">
      <Search className="h-12 w-12" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No rates found</h3>
    <p className="text-gray-500">{message}</p>
  </div>
);

// Currencies constant
const CURRENCIES = [
  { name: "Nigeria Naira", code: "NGN" },
  { name: "Ghana Cedis", code: "GHS" },
] as const;

// New rate modal component
const NewRateModal = React.memo(({ onClose }: { onClose: () => void }) => {
  const [data, setData] = useState<Partial<ExchangeRate>>({});
  const [error, setError] = useState("");
  const { addRate } = useAdminRates();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setData((prev) => ({
        ...prev,
        [name]:
          name === "rate"
            ? isNaN(Number(value))
              ? value
              : Number(value)
            : value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!data.from_currency || !data.to_currency || !data.rate) {
        setError("Please fill in all required fields");
        return;
      }

      try {
        setError("");
        addRate.mutate(data as ExchangeRate, {
          onSuccess: () => {
            toast.success("Rate created successfully");
            onClose();
          },
          onError: (error: Error) => {
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage =
              axiosError?.response?.data?.message || error.message;
            toast.error(errorMessage);
            setError(errorMessage);
          },
        });
      } catch (error) {
        console.error("Error creating rate:", error);
        setError("An unexpected error occurred");
      }
    },
    [data, addRate, onClose]
  );

  const availableToCurrencies = useMemo(
    () => CURRENCIES.filter((currency) => currency.code !== data.from_currency),
    [data.from_currency]
  );

  const ratePreview = useMemo(() => {
    if (!data.rate || !data.from_currency || !data.to_currency) return null;

    const rate = Number(data.rate);
    if (isNaN(rate)) return null;

    return `${GetCurrencySymbol(data.from_currency)} 1 = ${GetCurrencySymbol(
      data.to_currency
    )} ${rate.toLocaleString(undefined, {
      minimumFractionDigits: 5,
      maximumFractionDigits: 8,
    })}`;
  }, [data]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Add New Rate</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="from_currency"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              From Currency
            </label>
            <select
              id="from_currency"
              name="from_currency"
              onChange={handleInputChange}
              value={data.from_currency || ""}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
              required
            >
              <option value="">Select From Currency</option>
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="to_currency"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              To Currency
            </label>
            <select
              id="to_currency"
              name="to_currency"
              onChange={handleInputChange}
              value={data.to_currency || ""}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
              required
            >
              <option value="">Select To Currency</option>
              {availableToCurrencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="rate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Rate
            </label>
            <input
              type="number"
              id="rate"
              name="rate"
              onChange={handleInputChange}
              value={data.rate || ""}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
              placeholder="Enter new rate"
              step="any"
              required
            />
          </div>

          {ratePreview && (
            <p className="text-sm text-gray-500">New Rate: {ratePreview}</p>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button
            type="submit"
            disabled={addRate.isPending}
            className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-xl"
          >
            {addRate.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              "Add New Rate"
            )}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
});
NewRateModal.displayName = "NewRateModal";

// Main component
export default function RatesPage() {
  const [addRateModalOpen, setAddRateModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRatesInfiniteQuery({ search });

  const debouncedSearchChange = useMemo(
    () => debounce((value: string) => setSearch(value), 300),
    []
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSearchChange(e.target.value);
    },
    [debouncedSearchChange]
  );

  const handleAddRateModalToggle = useCallback(() => {
    setAddRateModalOpen((prev) => !prev);
  }, []);

  const { platformRate, ratesData } = useMemo(() => {
    const firstRate = data?.pages?.[0]?.data?.[0] || null;
    const rates =
      data?.pages.flatMap((page) =>
        page?.data?.map((rate) => ({
          ...rate,
          amount: rate.rate,
          date: rate.created_at,
          direction: `${rate.from_currency} to ${rate.to_currency}`,
          status: rate.active ? "Active" : "Inactive",
        }))
      ) || [];

    return { platformRate: firstRate, ratesData: rates };
  }, [data]);

  const formatRate = useCallback((rate: number) => {
    return rate.toLocaleString(undefined, {
      minimumFractionDigits: 5,
      maximumFractionDigits: 8,
    });
  }, []);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Failed to load rates. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-red-600 underline"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card className="rounded-2xl bg-secondary text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-light">API Based Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1 NGN = GHS 0.0068</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-[#F97316] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-light">
              Last Added Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="animate-pulse w-[250px] h-7 rounded-lg bg-orange-50/50" />
            ) : platformRate ? (
              <div className="text-2xl font-bold">
                1 {platformRate.from_currency} = {platformRate.to_currency}{" "}
                {formatRate(platformRate.rate)}
              </div>
            ) : (
              <div className="text-2xl font-bold text-orange-200">
                No rates available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Controls and Table */}
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 w-full flex-wrap">
            <SelectBox className="rounded-full bg-white py-2.5 px-3 w-full block">
              <option value="all">All Direction</option>
              <option value="ngn-ghs">NGN to GHS</option>
              <option value="ghs-ngn">GHS to NGN</option>
            </SelectBox>

            <div className="relative w-full sm:w-auto lg:ml-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                onChange={handleSearchChange}
                placeholder="Search rates..."
                className="bg-white border border-gray-200 rounded-full py-2.5 pl-11 pr-4 w-full sm:w-64 focus:ring-1 outline-0 focus:ring-primary focus:border-primary"
              />
            </div>

            <Button
              onClick={handleAddRateModalToggle}
              className="bg-[#0A4F49] hover:bg-[#083b36] text-white w-full sm:w-auto rounded-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Rate
            </Button>
          </div>
        </div>

        <div className="space-y-4 bg-white p-6 rounded-2xl">
          {isLoading ? (
            <LoadingSkeleton />
          ) : ratesData.length === 0 ? (
            <EmptyState
              message={
                search
                  ? "No rates match your search criteria"
                  : "No rates have been added yet"
              }
            />
          ) : (
            <>
              <Table>
                <TableHeader className="bg-white">
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox />
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Direction <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Amount <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Date <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        Status <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white">
                  {ratesData.map((rate, index) => (
                    <TableRow key={`${rate.id || index}`}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell className="font-medium">
                        {rate.direction}
                      </TableCell>
                      <TableCell>{formatRate(rate.amount)}</TableCell>
                      <TableCell>
                        {rate.date ? formatDateTime(rate.date) : "N/A"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={
                            rate.status as "Active" | "Inactive" | "Pending"
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {hasNextPage && (
                <div className="flex justify-center mt-6">
                  <Button
                    variant="default"
                    className="bg-secondary hover:bg-secondary/90 text-white font-semibold rounded-xl"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Load More
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {addRateModalOpen && (
          <NewRateModal onClose={handleAddRateModalToggle} />
        )}
      </AnimatePresence>
    </div>
  );
}
