"use client";

import { Search, LogOut, Settings, LucideUser, LucideMenu } from "lucide-react";
import { useState, useRef, useEffect, ChangeEvent } from "react";

// import HeaderNotification from "./HeaderNotification";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthContext } from "../contexts/UserAuthContext";
import _, { result } from "lodash";
import Link from "next/link";
import { useMiniSearch } from "@/store/search";
import MiniSearch, { SearchResult } from "minisearch";

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

const paths = [
  {
    path: "/dashboard",
    name: "Dashboard",
  },
  {
    path: "/users",
    name: "Users",
  },
  {
    path: "/transactions",
    name: "Transactions",
  },
  {
    path: "/rates",
    name: "Rates",
  },
  {
    path: "/platform-settings",
    name: "Platform Settings",
  },
  {
    path: "/settings",
    name: "Settings",
  },
  {
    path: "/notifications",
    name: "Notifications",
  },
];
export function Header({ onMobileMenuToggle }: HeaderProps) {
  const { user, logout } = useAuthContext();
  const { miniSearch } = useMiniSearch();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [openSearchDropDown, setSearchDropDown] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = usePathname();
  const router = useRouter();

  const getHeaderTitle = () =>
    paths
      .find((item) => item.path === location || location.includes(item.path))
      ?.name?.replace("-", " ") || "Dashboard";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (searchQuery.length) {
      const results = miniSearch.search(searchQuery);
      if (results.length > 0) {
        setSearchDropDown(true);
        setSearchResults(results);
        return;
      }
      setSearchDropDown(false);
    }
  }, [searchQuery, miniSearch]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <button
          className="block md:hidden cursor-pointer"
          onClick={onMobileMenuToggle}
        >
          <LucideMenu size={18} />
        </button>
        <div className="flex-1">
          <h1 className="md:text-2xl font-semibold text-gray-900">
            {getHeaderTitle()}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative md:block hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                onChange={handleSearchChange}
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
            <AnimatePresence>
              {openSearchDropDown && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white absolute w-full z-50 top-[120%] rounded-xl p-2 border border-black/20"
                >
                  <ul>
                    {searchResults?.map((res) => (
                      <li
                        key={res.id}
                        className="p-2 rounded hover:bg-gray-50 hover:text-secondary"
                      >
                        {res.link ? (
                          <Link
                            href={res.link}
                            onClick={() => setSearchDropDown(false)}
                          >
                            <span className="block hover:text-blue-500 hover:underline">
                              {res.title}
                            </span>
                            <span className="text-xs text-gray-400">
                              {res.type.toUpperCase()}
                            </span>
                          </Link>
                        ) : (
                          <>
                            <span className="block">{res.title}</span>
                            <span className="text-xs text-gray-400">
                              {res.type}
                            </span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          {/* <HeaderNotification /> */}

          {/* User Profile */}
          <div className="flex items-center md:space-x-3 cursor-pointer select-none">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.first_name?.charAt(0)}
                {user?.last_name?.charAt(0)}
              </span>
            </div>

            <div
              ref={profileRef}
              className="relative text-sm cursor-pointer select-none md:block hidden"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              <div className="font-medium text-gray-900 ">
                {user?.first_name} {user?.last_name}
              </div>
              <div className="text-gray-500">Admin</div>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-6 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                  >
                    <ul className="py-2">
                      <li className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0">
                        <Link
                          href="/settings"
                          className="flex item-center gap-2"
                        >
                          <span className="text-teal-500">
                            <LucideUser size={18} />
                          </span>
                          Profile
                        </Link>
                      </li>
                      <li className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0">
                        <Link
                          href={"/platform-settings"}
                          className="flex item-center gap-2"
                        >
                          <span className="text-orange-500">
                            <Settings size={18} />
                          </span>
                          Settings
                        </Link>
                      </li>
                      <li className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors">
                        <button
                          onClick={handleLogout}
                          className="flex item-center gap-2"
                        >
                          <span className="text-red-500">
                            <LogOut size={18} />
                          </span>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
