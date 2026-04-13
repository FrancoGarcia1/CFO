'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/auth-provider';
import type { Historical } from '@/types/domain';

const QUERY_KEY = 'historical';

export function useHistorical() {
  const { user } = useAuth();
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: historical = [], isLoading } = useQuery<Historical[]>({
    queryKey: [QUERY_KEY, user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('historical')
        .select('*')
        .eq('user_id', user.id)
        .order('year', { ascending: true })
        .order('month', { ascending: true });

      if (error) throw error;
      return data as Historical[];
    },
    enabled: !!user,
  });

  const upsertHistorical = useMutation({
    mutationFn: async (
      row: Omit<Historical, 'id'>,
    ) => {
      if (!user) throw new Error('User not authenticated');
      const { data, error } = await supabase
        .from('historical')
        .upsert(
          { ...row, user_id: user.id },
          { onConflict: 'user_id,year,month' },
        )
        .select()
        .single();

      if (error) throw error;
      return data as Historical;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, user?.id] });
    },
  });

  return { historical, isLoading, upsertHistorical };
}
