import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAdminUserSettings,
    updateAdminProfilePicture,
    updateAdminProfile,
    changeAdminPassword,
    AdminProfileData
} from '../funcs/adminSettings/AdminUserSettingsFuncs';

export function useAdminUserSettingsQuery() {
    return useQuery({
        queryKey: ['admin', 'userSettings'],
        queryFn: () => getAdminUserSettings(),
        staleTime: 5 * 60 * 1000,
    });
}

export default function useAdminUserSettings() {
    const queryClient = useQueryClient();

    const updateProfilePictureMutation = useMutation({
        mutationFn: (file: File) => updateAdminProfilePicture(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'userSettings'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });

    const updateProfileMutation = useMutation({
        mutationFn: (profileData: Partial<AdminProfileData>) => updateAdminProfile(profileData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'userSettings'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });

    const changePasswordMutation = useMutation({
        mutationFn: (passwordData: { currentPassword: string; newPassword: string }) =>
            changeAdminPassword(passwordData),
    });

    return {
        // Queries
        useAdminUserSettings: useAdminUserSettingsQuery,

        // Mutations
        updateProfilePicture: updateProfilePictureMutation,
        updateProfile: updateProfileMutation,
        changePassword: changePasswordMutation,
    };
}
