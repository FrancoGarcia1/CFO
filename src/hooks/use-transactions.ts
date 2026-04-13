'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/auth-provider';
import type { Transaction } from '@/types/domain';

const QUERY_KEY = 'transactions';

export function useTransactions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  const query = useQuery<Transaction[]>({
    queryKey: [QUERY_KEY, userId],
    queryFn: async () => {
      if (!userId) return [];
      const supabase = createClient();
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;
      return (data ?? []) as Transaction[];
    },
    enabled: !!userId,
  });

  const transactions = query.data ?? [];
  const isLoading = query.isLoading;

  const createTransaction = useMutation({
    mutationFn: async (
      txn: Omit<Transaction, 'id' | 'user_id' | 'created_at'>,
    ) => {
      if (!userId) throw new Error('No autenticado');
      const supabase = createClient();
      const { data, error } = await supabase
        .from('transactions')
        .insert({ ...txn, user_id: userId })
        .select()
        .single();

      if (error) throw error;
      return data as Transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  return { transactions, isLoading, createTransaction, deleteTransaction };
}
