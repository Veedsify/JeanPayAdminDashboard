"use client";
import { changeAdminPassword } from "@/data/funcs/adminSettings/AdminSettingsFuncs";
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
import { ToggleSwitch } from "@/components/settings/ToggleSwitch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import useAdminSettings, {
  usePlatformSettingsQuery,
} from "@/data/hooks/AdminSettingsHook";
import toast from "react-hot-toast";

const PlatformSettingsPage = () => {
  const { data } = usePlatformSettingsQuery();
  const { updateSettings } = useAdminSettings();

  const [kycEnforcement, setKycEnforcement] = useState<boolean>(false);
  const [manualRateOverride, setManualRateOverride] = useState<boolean>(false);
  const [transactionEmails, setTransactionEmails] = useState<boolean>(false);
  const [defaultCurrency, setDefaultCurrency] = useState<string>("NGN");
  const [minimumTransaction, setMinimumTransaction] = useState<
    number | undefined
  >(undefined);
  const [maximumTransaction, setMaximumTransaction] = useState<
    number | undefined
  >(undefined);
  const [dailyUserCap, setDailyUserCap] = useState<number | undefined>(
    undefined,
  );
  // theme, notifications and security
  const [theme, setTheme] = useState<string>("light");
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [smsNotifications, setSmsNotifications] = useState<boolean>(false);
  const [pushNotifications, setPushNotifications] = useState<boolean>(true);
  const [enforceTwoFactor, setEnforceTwoFactor] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState<string>("");
  const [newPasswordInput, setNewPasswordInput] = useState<string>("");
  const [sendTransactionSuccess, setSendTransactionSuccess] =
    useState<boolean>(true);
  const [sendTransactionDecline, setSendTransactionDecline] =
    useState<boolean>(true);
  const [sendTransactionPending, setSendTransactionPending] =
    useState<boolean>(true);
  const [sendTransactionRefund, setSendTransactionRefund] =
    useState<boolean>(true);
  const [accountLimitsNotification, setAccountLimitsNotification] =
    useState<boolean>(true);

  useEffect(() => {
    const s =
      (data as { data?: Record<string, unknown> } | undefined)?.data ?? {};
    if (s) {
      setKycEnforcement(!!s.kycEnforcement);
      setManualRateOverride(!!s.manualRateOverride);
      setTransactionEmails(!!s.transactionEmails);
      setDefaultCurrency((s.defaultCurrency as string) || "NGN");
      setMinimumTransaction((s.minimumTransaction as number) || undefined);
      setMaximumTransaction((s.maximumTransaction as number) || undefined);
      setDailyUserCap((s.dailyUserCap as number) || undefined);
      // theme/notifications/security
      setTheme((s.theme as string) || "light");
      setEmailNotifications(!!s.emailNotifications);
      setSmsNotifications(!!s.smsNotifications);
      setPushNotifications(!!s.pushNotifications);
      setEnforceTwoFactor(!!s.enforceTwoFactor);
      setSendTransactionSuccess(!!s.sendTransactionSuccess);
      setSendTransactionDecline(!!s.sendTransactionDecline);
      setSendTransactionPending(!!s.sendTransactionPending);
      setSendTransactionRefund(!!s.sendTransactionRefund);
      setAccountLimitsNotification(!!s.accountLimitsNotification);
    }
  }, [data]);

  const handleSave = async () => {
    await updateSettings.mutateAsync(
      {
        kycEnforcement,
        manualRateOverride,
        defaultCurrency,
        transactionEmails,
        minimumTransaction,
        maximumTransaction,
        dailyUserCap,
        theme,
        emailNotifications,
        smsNotifications,
        pushNotifications,
        enforceTwoFactor,
        sendTransactionSuccess,
        sendTransactionDecline,
        sendTransactionPending,
        sendTransactionRefund,
        accountLimitsNotification,
      },
      {
        onSuccess: () => {
          toast.success("Settings updated successfully!");
        },
        onError: (error) => {
          // Handle error case
          toast.error("Failed to update settings. Please try again.");
          console.error("Failed to update settings:", error);
        },
      },
    );
  };

  const handleChangePassword = async () => {
    try {
      await changeAdminPassword({
        currentPassword: currentPasswordInput,
        newPassword: newPasswordInput,
      });
      toast.success("Password changed successfully");
      setShowPasswordModal(false);
      setCurrentPasswordInput("");
      setNewPasswordInput("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to change password");
    }
  };

  return (
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
                  <Switch
                    id="kyc-enforcement"
                    checked={kycEnforcement}
                    onCheckedChange={(v) => setKycEnforcement(!!v)}
                  />
                </SettingsRow>
                <SettingsRow
                  title="Manual Rate Override"
                  description="Allow admins to manually set exchange rates."
                >
                  <Switch
                    id="manual-rate-override"
                    checked={manualRateOverride}
                    onCheckedChange={(v) => setManualRateOverride(!!v)}
                  />
                </SettingsRow>
                <SettingsRow
                  title="Transaction Confirmation Emails"
                  description="Send email confirmations after each transaction."
                >
                  <Switch
                    checked={transactionEmails}
                    id="transaction-emails"
                    onCheckedChange={(v) => setTransactionEmails(!!v)}
                  />
                </SettingsRow>
                <SettingsRow
                  title="Default Currency Display"
                  description="Select the default platform currency."
                >
                  <Select
                    onValueChange={(v) => setDefaultCurrency(v.toUpperCase())}
                    value={defaultCurrency}
                  >
                    <SelectTrigger className="w-full md:w-[250px]">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">(NGN) Nigerian Naira</SelectItem>
                      <SelectItem value="GHS">(GHS) Ghana Cedis</SelectItem>
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Minimum Transaction
                  </label>
                  <input
                    type="number"
                    value={minimumTransaction ?? ""}
                    onChange={(e) =>
                      setMinimumTransaction(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    placeholder="e.g. 100"
                    className="w-full px-3 py-2.5 border border-gray-200/80 rounded-lg bg-primary-green-50/50 focus:ring-primary-green-600 focus:border-primary-green-600"
                  />
                  <p className="text-xs text-gray-500">
                    Minimum amount per transaction (in NGN).
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Maximum Transaction
                  </label>
                  <input
                    type="number"
                    value={maximumTransaction ?? ""}
                    onChange={(e) =>
                      setMaximumTransaction(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    placeholder="e.g. 1,000,000"
                    className="w-full px-3 py-2.5 border border-gray-200/80 rounded-lg bg-primary-green-50/50 focus:ring-primary-green-600 focus:border-primary-green-600"
                  />
                  <p className="text-xs text-gray-500">
                    Maximum amount per transaction (in NGN).
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Daily User Cap
                  </label>
                  <input
                    type="number"
                    value={dailyUserCap ?? ""}
                    onChange={(e) =>
                      setDailyUserCap(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    placeholder="e.g. 5,000,000"
                    className="w-full px-3 py-2.5 border border-gray-200/80 rounded-lg bg-primary-green-50/50 focus:ring-primary-green-600 focus:border-primary-green-600"
                  />
                  <p className="text-xs text-gray-500">
                    Maximum daily total for a single user (in NGN).
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-100">
              <Button variant="outline">Cancel</Button>
              <Button
                variant={"default"}
                className="bg-secondary cursor-pointer hover:bg-secondary/90"
                onClick={handleSave}
              >
                {updateSettings?.status === "pending"
                  ? "Saving..."
                  : "Save Changes"}
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
                    <ToggleSwitch
                      enabled={theme === "light"}
                      onChange={(v) => setTheme(v ? "light" : "dark")}
                    />
                    <span className="text-sm font-medium text-gray-600">
                      Dark
                    </span>
                  </div>
                </SettingsRow>
                <SettingsRow title="Chart Style">
                  <div className="flex items-center gap-4">
                    <select
                      className="w-3xs py-2.5 px-2 border border-black/30 rounded-xl active:shadow"
                      name="chart-type"
                      id=""
                    >
                      <option value="">Select Chart Type</option>
                      <option value="line">Line Chart</option>
                      <option value="bar">Bar Chart</option>
                      <option value="area">Area Chart</option>
                      <option value="pie">Pie Chart</option>
                    </select>
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
                  <ToggleSwitch
                    enabled={sendTransactionSuccess}
                    onChange={setSendTransactionSuccess}
                  />
                </SettingsRow>
                <SettingsRow
                  title="Transactions Declined"
                  description="Send users a transactions declined notification"
                >
                  <ToggleSwitch
                    enabled={sendTransactionDecline}
                    onChange={setSendTransactionDecline}
                  />
                </SettingsRow>
                <SettingsRow
                  title="Refunded Notifications"
                  description="Send users a refunded notification when a transaction gets refunded"
                >
                  <ToggleSwitch
                    enabled={sendTransactionRefund}
                    onChange={setSendTransactionRefund}
                  />
                </SettingsRow>
                <SettingsRow title="Account Limits Notifications">
                  <ToggleSwitch
                    enabled={accountLimitsNotification}
                    onChange={setAccountLimitsNotification}
                  />
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
                onClick={handleSave}
              >
                {updateSettings?.status === "pending"
                  ? "Saving..."
                  : "Save Changes"}
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
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change Password
                  </Button>
                </SettingsRow>
                <SettingsRow
                  title="Two factor authentication"
                  description="Add an extra layer of security to your account"
                >
                  <div>
                    <Switch
                      id="two-factor-auth"
                      checked={enforceTwoFactor}
                      onCheckedChange={async (v) => {
                        const newVal = !!v;
                        setEnforceTwoFactor(newVal);
                      }}
                    />
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
                onClick={handleSave}
              >
                {updateSettings?.status === "pending"
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
            </div>
          </div>
        </TabsContent>

        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
            >
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setShowPasswordModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative bg-white rounded-lg p-6 w-full max-w-md z-10"
              >
                <h3 className="text-lg font-semibold mb-4">
                  Change Admin Password
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm mb-1 inline-block">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPasswordInput}
                      onChange={(e) => setCurrentPasswordInput(e.target.value)}
                      className="w-full px-3 py-2 border border-black/30 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm mb-1 inline-block">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="w-full px-3 py-2 border border-black/30 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    className="bg-secondary"
                    onClick={handleChangePassword}
                  >
                    Change Password
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
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

export default PlatformSettingsPage;
