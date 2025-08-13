"use client";

import { Search } from "lucide-react";

export function SearchInput({
  placeholder,
  className,
}: {
  placeholder: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="search"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 rounded-lg outline-0"
      />
    </div>
  );
}
