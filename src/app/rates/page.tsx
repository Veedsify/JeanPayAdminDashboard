"use client";

import * as React from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  ArrowUpDown,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MinusCircle,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { useState } from "react";

// Mock Data and Components - assuming these would be in separate files in a real app

const ratesData = [
  {
    id: "r1",
    direction: "GHS to NGN",
    amount: "GHS 5,000",
    date: "2028-09-20",
    status: "Active",
  },
  {
    id: "r2",
    direction: "GHS to NGN",
    amount: "GHS 45,000",
    date: "2028-09-22",
    status: "Inactive",
  },
  {
    id: "r3",
    direction: "NGN to GHS",
    amount: "NGN 56,000",
    date: "2028-09-23",
    status: "Inactive",
  },
  {
    id: "r4",
    direction: "GHS to NGN",
    amount: "GHS 8,892",
    date: "2028-09-24",
    status: "Inactive",
  },
  {
    id: "r5",
    direction: "NGN to GHS",
    amount: "NGN 90,000",
    date: "2028-09-25",
    status: "Inactive",
  },
  {
    id: "r6",
    direction: "GHS to NGN",
    amount: "GHS 56,990",
    date: "2028-09-26",
    status: "Active",
  },
  {
    id: "r7",
    direction: "NGN to GHS",
    amount: "NGN 78,722",
    date: "2028-09-27",
    status: "Inactive",
  },
  {
    id: "r8",
    direction: "GHS to NGN",
    amount: "GHS 4,399",
    date: "2028-09-28",
    status: "Inactive",
  },
  {
    id: "r9",
    direction: "NGN to GHS",
    amount: "NGN 8,000",
    date: "2028-09-29",
    status: "Pending",
  },
  {
    id: "r10",
    direction: "GHS to NGN",
    amount: "GHS 9,922",
    date: "2028-09-30",
    status: "Active",
  },
];

// NOTE: The following are mock components that would likely exist in a real implementation
// based on the design system.

const Checkbox = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    type="checkbox"
    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
    {...props}
  />
);

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

const Select = ({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  children: React.ReactNode;
}) => (
  <div className="relative">
    <select
      className="h-10 w-full appearance-none rounded-md border border-input bg-background pl-3 pr-8 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    >
      {children}
    </select>
  </div>
);

const StatusBadge = ({
  status,
}: {
  status: "Active" | "Inactive" | "Pending";
}) => {
  const baseClasses =
    "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold";

  if (status === "Active") {
    return (
      <div className={`${baseClasses} bg-[#E9F8EE] text-[#147D3B]`}>
        <CheckCircle2 className="w-4 h-4 mr-1.5" />
        Active
      </div>
    );
  }
  if (status === "Inactive") {
    return (
      <div className={`${baseClasses} bg-[#F0F2F5] text-[#5A6474]`}>
        <MinusCircle className="w-4 h-4 mr-1.5" />
        Inactive
      </div>
    );
  }
  return (
    <div className={`${baseClasses} bg-[#F0F2F5] text-[#5A6474]`}>
      <MoreHorizontal className="w-4 h-4 mr-1.5" />
      Pending
    </div>
  );
};

export default function RatesPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 28),
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card className="rounded-2xl bg-secondary text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-light">
                Api Based Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1 NGN = GHS 0.0068</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl bg-[#F97316] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-light">
                Platform Based Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1 NGN = GHS 0.0078</div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 w-full flex-wrap">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"ghost"}
                    className={cn(
                      "w-full md:w-[260px] justify-start rounded-full text-left font-normal bg-white",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "dd MMM yyyy")} -{" "}
                          {format(date.to, "dd MMM yyyy")}
                        </>
                      ) : (
                        format(date.from, "dd MMM yyyy")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <Select className="rounded-full bg-white py-2.5 px-3 w-full block">
                <option value="all">All Direction</option>
                <option value="ngn-ghs">NGN to GHS</option>
                <option value="ghs-ngn">GHS to NGN</option>
              </Select>
              <div className="relative w-full sm:w-auto lg:ml-auto">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search invoice ID, users, etc."
                  className="bg-white border border-gray-200 rounded-full py-2.5 pl-11 pr-4 w-full sm:w-64 focus:ring-1 outline-0 focus:ring-primary focus:border-primary"
                />
              </div>
              <Button className="bg-[#0A4F49] hover:bg-[#083b36] text-white w-full sm:w-auto rounded-full ">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Rate</span>
                </div>
              </Button>
            </div>
          </div>
          <div className="space-y-4 bg-white p-6 rounded-2xl">
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
                {ratesData.map((rate) => (
                  <TableRow key={rate.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-medium">
                      {rate.direction}
                    </TableCell>
                    <TableCell>{rate.amount}</TableCell>
                    <TableCell>{rate.date}</TableCell>
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

            <div className="flex flex-col md:flex-row gap-6 justify-between md:items-center mt-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Showing</span>
                <Button
                  variant="ghost"
                  className="font-normal border text-gray-600 px-3"
                >
                  <div className="flex items-center gap-2">
                    <span>10</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </Button>
                <span className="text-gray-600">out of 512</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 bg-gray-100/70 rounded-full"
                >
                  <ChevronLeft size={20} />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="h-9 w-9 bg-primary rounded-full"
                >
                  1
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="h-9 w-9  rounded-full bg-gray-100/70 text-gray-600"
                >
                  2
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="h-9 w-9  rounded-full bg-gray-100/70 text-gray-600"
                >
                  3
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9  rounded-full bg-gray-100/70 text-gray-600"
                >
                  ...
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="h-9 w-9  rounded-full bg-gray-100/70 text-gray-600"
                >
                  16
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="h-9 w-9  rounded-full bg-gray-100/70 text-gray-600"
                >
                  <ChevronRight size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
