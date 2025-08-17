"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Calendar as CalendarIcon,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import Link from "next/link";
import { users } from "@/data/users";

// Mock data to populate the table, based on the provided image.

const UsersPage = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 28),
  });

  return (
    <>
      {/* Main Content Card */}
      <div className="">
        {/* Top Controls: Search, Filters, and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users"
                className="w-full h-10 pl-11 pr-4 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <Button variant="ghost" className="h-10 text-gray-600 font-medium">
              <span>Sort</span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="ghost" className="h-10 text-gray-600 font-medium">
              <span>Filter</span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"ghost"}
                  className="h-10 border border-gray-200 text-gray-600 font-medium flex-1 md:flex-none justify-between"
                >
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 ml-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button className="h-10 rounded-full bg-secondary hover:bg-secondary/90 text-white flex-1 md:flex-none">
              <Plus className="w-5 h-5 mr-1" />
              <span>New User</span>
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto bg-white p-6 rounded-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="p-4 w-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                </th>
                <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Last Transaction
                </th>
                <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Total Transactions
                </th>
                <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-8">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-700">
                    {user.id}
                  </td>
                  <td className="p-4 text-sm text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0A2540]" />
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{user.email}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {user.lastTransaction}
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900">
                    {user.totalTransactions}
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/users/details/${user.id}`}
                      className="h-8 px-4 py-1 text-sm cursor-pointer bg-secondary rounded-full hover:bg-secondary/90 text-white font-semibold"
                    >
                      view
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 md:mb-0">
            <span>Showing</span>
            <div className="relative">
              <select className="appearance-none h-8 pl-3 pr-8 rounded-md border border-gray-200 bg-white focus:outline-none text-gray-800 font-medium">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <span>out of 512</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer h-8 w-8 text-gray-500 hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full cursor-pointer h-8 w-8 bg-primary text-white font-bold hover:bg-[#d0f0ec]"
            >
              1
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full cursor-pointer h-8 w-8 text-gray-600 hover:bg-gray-100"
            >
              2
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full cursor-pointer h-8 w-8 text-gray-600 hover:bg-gray-100"
            >
              3
            </Button>
            <span className="px-2 text-gray-400">...</span>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full cursor-pointer h-8 w-8 text-gray-600 hover:bg-gray-100"
            >
              16
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer h-8 w-8 text-gray-500 hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersPage;
