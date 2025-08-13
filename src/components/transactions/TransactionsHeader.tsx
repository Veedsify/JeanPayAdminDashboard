import { Button } from "@/components/ui/Button";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Plus,
  Search,
} from "lucide-react";

const TransactionsHeader = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
        <Button
          variant="ghost"
          className="w-full justify-between font-normal text-gray-600 hover:bg-white/50 rounded-full bg-white"
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span>20 Sep - 8 Oct 2028</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-between font-normal text-gray-600 hover:bg-white/50 rounded-full bg-white"
        >
          <span>All Customer</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-between font-normal text-gray-600 hover:bg-white/50 rounded-full bg-white"
        >
          <span>All Status</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </div>

      {/* Search and Add Transaction */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoice ID, patient, etc."
            className="bg-white border border-gray-200 rounded-full py-2.5 pl-11 pr-4 w-full sm:w-64 focus:ring-1 outline-0 focus:ring-primary focus:border-primary"
          />
        </div>
        <Button className="bg-[#0A4F49] hover:bg-[#083b36] text-white w-full sm:w-auto rounded-full">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Transaction</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default TransactionsHeader;
