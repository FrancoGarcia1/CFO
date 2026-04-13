'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Visitor, Occupancy } from '@/types/domain';

const VISITORS_KEY = 'visitors';
const OCCUPANCY_KEY = 'occupancy';

async function getUserId() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export function useVisitors() {
  const queryClient = useQueryClient();

  const vQuery = useQuery<Visitor[]>({
    queryKey: [VISITORS_KEY],
    queryFn: async () => {
      const uid = await getUserId();
      if (!uid) return [];
      const supabase = createClient();
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .eq('user_id', uid)
        .order('date', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Visitor[];
    },
  });

  const oQuery = useQuery<Occupancy[]>({
    queryKey: [OCCUPANCY_KEY],
    queryFn: async () => {
      const uid = await getUserId();
      if (!uid) return [];
      const supabase = createClient();
      const { data, error } = await supabase
        .from('occupancy')
        .select('*')
        .eq('user_id', uid)
        .order('date', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Occupancy[];
    },
  });

  const visitors = vQuery.data ?? [];
  const occupancy = oQuery.data ?? [];
  const isLoading = vQuery.isLoading || oQuery.isLoading;

  const upsertVisitor = useMutation({
    mutationFn: async (row: Omit<Visitor, 'id'>) => {
      const uid = await getUserId();
      if (!uid) throw new Error('No autenticado');
      const supabase = createClient();
      const { data, error } = await supabase
        .from('visitors')
        .upsert({ ...row, user_id: uid }, { onConflict: 'user_id,date' })
        .select()
        .single();
      if (error) throw error;
      return data as Visitor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VISITORS_KEY] });
    },
  });

  const upsertOccupancy = useMutation({
    mutationFn: async (row: Omit<Occupancy, 'id'>) => {
      const uid = await getUserId();
      if (!uid) throw new Error('No autenticado');
      const supabase = createClient();
      const { data, error } = await supabase
        .from('occupancy')
        .upsert({ ...row, user_id: uid }, { onConflict: 'user_id,date' })
        .select()
        .single();
      if (error) throw error;
      return data as Occupancy;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OCCUPANCY_KEY] });
    },
  });

  return { visitors, occupancy, isLoading, upsertVisitor, upsertOccupancy };
}
