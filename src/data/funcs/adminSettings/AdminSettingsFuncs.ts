import axiosClient from "@/lib/axios";

export interface PlatformSettingsRequest {
    kycEnforcement?: boolean;
    manualRateOverride?: boolean;
    defaultCurrency?: string;
    transactionEmails?: boolean;
    minimumTransaction?: number;
    maximumTransaction?: number;
    dailyUserCap?: number;
    // theme, notifications and security
    theme?: string;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    pushNotifications?: boolean;
    enforceTwoFactor?: boolean;
    sessionTimeoutMinutes?: number;
    passwordExpiryDays?: number;
    // granular notifications
    sendTransactionSuccess?: boolean;
    sendTransactionDecline?: boolean;
    sendTransactionPending?: boolean;
    sendTransactionRefund?: boolean;
    accountLimitsNotification?: boolean;
}

interface PlatformSettingsResponse {
    kycEnforcement: boolean;
    manualRateOverride: boolean;
    defaultCurrency: string;
    transactionEmails: boolean;
    minimumTransaction: number;
    maximumTransaction: number;
    dailyUserCap: number;
    // theme, notifications and security
    theme: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    enforceTwoFactor: boolean;
    sessionTimeoutMinutes: number;
    passwordExpiryDays: number;
    // granular notifications
    sendTransactionSuccess: boolean;
    sendTransactionDecline: boolean;
    sendTransactionPending: boolean;
    sendTransactionRefund: boolean;
    accountLimitsNotification: boolean;
}

// Get platform settings
export async function getPlatformSettings() {
    const res = await axiosClient.get('/admin/settings/get');
    return res.data;
}

// Update platform settings
export async function updatePlatformSettings(payload: PlatformSettingsRequest) {
    const res = await axiosClient.patch('/admin/settings/update', payload);
    return res.data;
}

// Change admin password
export async function changeAdminPassword(payload: { currentPassword: string; newPassword: string }) {
    const res = await axiosClient.put('/protected/settings/change-password', payload);
    return res.data;
}

// Toggle two-factor authentication for admin user (simplified)
async function toggleAdminTwoFactor(enabled: boolean) {
    const res = await axiosClient.patch('/admin/settings/update', {
        enforceTwoFactor: enabled
    });
    return res.data;
}
