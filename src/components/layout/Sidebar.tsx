"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  Settings2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const location = usePathname();
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      link: "/dashboard",
      active: location.includes("/dashboard"),
    },
    {
      icon: Users,
      label: "Users",
      link: "/users",
      active: location.startsWith("/users"),
    },
    {
      icon: CreditCard,
      label: "Transactions",
      link: "/transactions",
      active: location.startsWith("/transactions"),
    },
    {
      icon: TrendingUp,
      label: "Rates",
      link: "/rates",
      active: location.startsWith("/rates"),
    },
    {
      icon: Settings,
      label: "Platform Settings",
      link: "/platform-settings",
      active: location.startsWith("/platform-settings"),
    },
    {
      icon: Settings2Icon,
      label: "Settings",
      link: "/settings",
      active: location.startsWith("/settings"),
    },
  ];
  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onMobileClose}
          />
        </AnimatePresence>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300 flex-col",
          // Desktop styles
          "md:flex",
          collapsed ? "md:w-16" : "md:w-64",
          // Mobile styles
          "fixed md:relative inset-y-0 left-0 z-50 w-64 transform md:transform-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          // Hide on mobile when closed, always show on desktop
          mobileOpen ? "flex" : "hidden md:flex"
        )}
      >
        {/* Header */}
        <div className="p-[22px] border-b border-gray-200 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <Image src={"/images/logo.png"} height={48} width={48} alt="logo" className="w-10 h-10 "/>
              <span className="font-bold text-gray-900">
                <span className="text-secondary">Jean</span>
                <span className="text-primary italic">Pay</span>
              </span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1 cursor-pointer hover:bg-gray-100 rounded-md transition-colors"
          >
            <Menu
              className={cn(
                "w-4 h-4 text-gray-500 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <AnimatePresence>
          <nav className="flex-1 p-4 space-y-3">
            {menuItems.map((item, index) => (
              <Link
                href={item.link}
                key={index}
                className={cn(
                  "flex items-center rounded-2xl text-sm font-medium transition-colors relative",
                  collapsed
                    ? "justify-center p-2 w-8 h-8"
                    : "w-full space-x-3 px-5 py-5",
                  item.active
                    ? "text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                {item.active && (
                  <motion.div
                    layoutId="active-nav-link"
                    className="absolute inset-0 bg-orange-500 rounded-2xl"
                    transition={{ type: "spring", stiffness: 250, damping: 25 }}
                  />
                )}
                <item.icon className="w-5 h-5 flex-shrink-0 z-10" />
                {!collapsed && <span className="z-10">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </AnimatePresence>
        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex cursor-pointer items-center space-x-3 px-3 py-2 rounded-2xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}
