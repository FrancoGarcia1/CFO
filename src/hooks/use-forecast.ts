'use client';

import { useMemo, useCallback } from 'react';
import type {
  Historical,
  Transaction,
  UserSettings,
  ForecastMonth,
} from '@/types/domain';
import { calcForecast, rollingAdjust } from '@/utils/calculations';
import { useSettings } from '@/hooks/use-settings';

export function useForecast(
  historical: Historical[],
  transactions: Transaction[],
  settings: UserSettings | null,
) {
  const { updateSettings } = useSettings();

  const growthRate = settings?.growth_rate ?? 5;

  const forecast: ForecastMonth[] = useMemo(
    () => calcForecast(historical, growthRate),
    [historical, growthRate],
  );

  const updateRollingForecast = useCallback(() => {
    const newRate = rollingAdjust(transactions, forecast, growthRate);
    const quarter = `${new Date().getFullYear()}-Q${Math.ceil((new Date().getMonth() + 1) / 3)}`;

    updateSettings.mutate({
      growth_rate: newRate,
      last_forecast_q: quarter,
    });
  }, [transactions, forecast, growthRate, updateSettings]);

  return { forecast, updateRollingForecast };
}
