"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { AnimatePresence } from "framer-motion";
import React from "react";

const PlatformSettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <Tabs defaultValue="general">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <AnimatePresence>
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="theme">Theme</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
            </AnimatePresence>
            <SearchInput
              placeholder="Search Settings"
              className="w-full md:w-64 ring-1 ring-black/20 rounded-full shadow-none focus:ring-primary border-0 outine-0"
            />
          </div>

          <TabsContent value="general">
            <div className="bg-white p-4 md:p-8 rounded-2xl mt-6 space-y-10">
              {/* Platform Preferences Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Platform Preferences
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Configure platform-wide settings and preferences.
                  </p>
                </div>

                <div className="divide-y divide-gray-100">
                  <SettingsRow
                    title="KYC Enforcement"
                    description="Enforce KYC verification for all new users."
                  >
                    <Switch id="kyc-enforcement" />
                  </SettingsRow>
                  <SettingsRow
                    title="Manual Rate Override"
                    description="Allow admins to manually set exchange rates."
                  >
                    <Switch id="manual-rate-override" defaultChecked />
                  </SettingsRow>
                  <SettingsRow
                    title="Transaction Confirmation Emails"
                    description="Send email confirmations after each transaction."
                  >
                    <Switch checked={true} id="transaction-emails" />
                  </SettingsRow>
                  <SettingsRow
                    title="Default Currency Display"
                    description="Select the default platform currency."
                  >
                    <Select>
                      <SelectTrigger className="w-full md:w-[250px]">
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ngn">
                          (NGN) Nigerian Naira
                        </SelectItem>
                        <SelectItem value="ghs">(GHS) Ghana Cedis</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingsRow>
                </div>
              </div>

              {/* Limits & User Caps Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Limits & User Caps
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Set Transaction, and daily user limits for all users
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <LimitInput
                    label="Minimum Transaction"
                    placeholder="e.g. 100"
                    description="Minimum amount per transaction (in NGN)."
                  />
                  <LimitInput
                    label="Maximum Transaction"
                    placeholder="e.g. 1,000,000"
                    description="Maximum amount per transaction (in NGN)."
                  />
                  <LimitInput
                    label="Daily User Cap"
                    placeholder="e.g. 5,000,000"
                    description="Maximum daily total for a single user (in NGN)."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-100">
                <Button variant="outline">Cancel</Button>
                <Button
                  variant={"default"}
                  className="bg-secondary cursor-pointer hover:bg-secondary/90"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="theme">
            <div className="bg-white p-4 md:p-8 rounded-2xl mt-6 space-y-10">
              {/* Theme & Appearance Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Theme & Appearance
                  </h3>
                </div>

                <div className="divide-y divide-gray-100">
                  <SettingsRow
                    title="Interface Theme"
                    description="Switch between light and dark mode."
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">
                        Light
                      </span>
                      <Switch id="interface-theme" />
                      <span className="text-sm font-medium text-gray-600">
                        Dark
                      </span>
                    </div>
                  </SettingsRow>
                  <SettingsRow title="Chart Style">
                    <div className="flex items-center gap-4">
                      <Select>
                        <SelectTrigger className="w-full md:w-[200px]">
                          <SelectValue placeholder="Line Chart" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="line">Line Chart</SelectItem>
                          <SelectItem value="bar">Bar Chart</SelectItem>
                        </SelectContent>
                      </Select>
                      <Switch id="chart-style" />
                    </div>
                  </SettingsRow>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-100">
                <Button variant="outline">Cancel</Button>
                <Button
                  variant={"default"}
                  className="bg-secondary cursor-pointer hover:bg-secondary/90"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="bg-white p-4 md:p-8 rounded-2xl mt-6 space-y-10">
              {/* Notification Preferences Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Notification Preferences
                  </h3>
                </div>

                <div className="divide-y divide-gray-100">
                  <SettingsRow
                    title="Transaction Successful"
                    description="Send users a transaction successful notification"
                  >
                    <Switch id="transaction-successful" />
                  </SettingsRow>
                  <SettingsRow
                    title="Transactions Declined"
                    description="Send users a transactions declined notification"
                  >
                    <Switch id="transaction-declined" />
                  </SettingsRow>
                  <SettingsRow
                    title="Refunded Notifications"
                    description="Send users a refunded notification when a transaction gets refunded"
                  >
                    <Switch id="refunded-notifications" />
                  </SettingsRow>
                  <SettingsRow title="Account Limits Notifications">
                    <Switch id="account-limits" />
                  </SettingsRow>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-100">
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
                <Button
                  variant={"default"}
                  className="bg-secondary cursor-pointer hover:bg-secondary/90"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="bg-white p-4 md:p-8 rounded-2xl mt-6 space-y-10">
              {/* Security Settings Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Security Settings
                  </h3>
                </div>

                <div className="divide-y divide-gray-100">
                  <SettingsRow
                    title="Admin Password"
                    description="Reset the main administrator password."
                  >
                    <Button
                      variant="default"
                      size={"sm"}
                      className="bg-secondary hover:bg-secondary/80 text-white"
                    >
                      Reset Password
                    </Button>
                  </SettingsRow>
                  <SettingsRow
                    title="Two factor authentication"
                    description="Add an extra layer of security to your account"
                  >
                    <Switch id="two-factor-auth" />
                  </SettingsRow>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// Helper component for settings rows
const SettingsRow = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <div className="md:flex items-start justify-between space-y-4 py-6">
    <div className="pr-4">
      <h4 className="font-semibold text-gray-700">{title}</h4>
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

// Helper component for limit inputs
const LimitInput = ({
  label,
  placeholder,
  description,
}: {
  label: string;
  placeholder: string;
  description: string;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      className="w-full px-3 py-2.5 border border-gray-200/80 rounded-lg bg-primary-green-50/50 focus:ring-primary-green-600 focus:border-primary-green-600"
    />
    <p className="text-xs text-gray-500">{description}</p>
  </div>
);

export default PlatformSettingsPage;
