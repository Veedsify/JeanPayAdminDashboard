"use client";
import { PageFunctionDoc } from "@/store/search";

export const searchDocument: PageFunctionDoc[] = [
  {
    id: 1,
    content:
      "users, userpages, users, content, check users, disabled, blocked, verified",
    title: "Users Page",
    type: "page",
    link: "/users",
  },
  {
    id: 2,
    content:
      "Transactions, successful, declined new transaction rejected transactions",
    title: "Transactions Page",
    type: "page",
    link: "/transactions",
  },
  {
    id: 3,
    content:
      "notifications, alerts, messages, unread, read, notification settings",
    title: "Notifications",
    type: "page",
    link: "/notifications",
  },
  {
    id: 4,
    content:
      "rates, exchange rates, currency rates, rate settings, update rates",
    title: "Rates",
    type: "page",
    link: "/rates",
  },
  {
    id: 5,
    content:
      "settings, account settings, profile settings, preferences, update settings",
    title: "Settings",
    type: "page",
    link: "/settings",
  },
  {
    id: 6,
    content:
      "platform settings, system settings, admin settings, configuration, platform preferences",
    title: "Platform Settings",
    type: "page",
    link: "/platform-settings",
  },
  {
    id: 7,
    content:
      "payment accounts, bank accounts, add account, payment methods, account management",
    title: "Payment Accounts",
    type: "page",
    link: "/payment-accounts",
  },
];
