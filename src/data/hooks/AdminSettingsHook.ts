import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPlatformSettings, updatePlatformSettings, PlatformSettingsRequest } from '../funcs/adminSettings/AdminSettingsFuncs';

export function usePlatformSettingsQuery() {
    return useQuery({
        queryKey: ['admin', 'platformSettings'],
        queryFn: () => getPlatformSettings(),
        staleTime: 5 * 60 * 1000,
    });
}

export default function useAdminSettings() {
    const queryClient = useQueryClient();

    const updateSettingsMutation = useMutation({
        mutationFn: async (data: PlatformSettingsRequest) => updatePlatformSettings(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'platformSettings'] });
        },
    });

    return {
        updateSettings: updateSettingsMutation,
    };
}
