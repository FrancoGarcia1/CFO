'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/auth-provider';
import type { UserSettings } from '@/types/domain';

const QUERY_KEY = 'user-settings';

export function useSettings() {
  const { user } = useAuth();
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: settings = null, isLoading } = useQuery<UserSettings | null>({
    queryKey: [QUERY_KEY, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return (data as UserSettings) ?? null;
    },
    enabled: !!user,
  });

  const updateSettings = useMutation({
    mutationFn: async (
      updates: Partial<Pick<UserSettings, 'growth_rate' | 'last_forecast_q'>>,
    ) => {
      if (!user) throw new Error('User not authenticated');
      const { data, error } = await supabase
        .from('user_settings')
        .upsert(
          { user_id: user.id, ...updates },
          { onConflict: 'user_id' },
        )
        .select()
        .single();

      if (error) throw error;
      return data as UserSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, user?.id] });
    },
  });

  return { settings, isLoading, updateSettings };
}
