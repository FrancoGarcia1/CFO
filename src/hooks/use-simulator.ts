'use client';

import { useState, useMemo, useCallback } from 'react';
import type { KPIs, SimulatorState, SimulatorResult } from '@/types/domain';
import { calcSimulation } from '@/utils/calculations';

const INITIAL_STATE: SimulatorState = { income: 0, cost: 0, expense: 0 };

export function useSimulator(kpis: KPIs) {
  const [simLines, setSimLines] = useState<SimulatorState>(INITIAL_STATE);

  const simResult: SimulatorResult = useMemo(
    () => calcSimulation(kpis, simLines),
    [kpis, simLines],
  );

  const setSimLine = useCallback(
    (key: keyof SimulatorState, value: number) => {
      setSimLines((prev: SimulatorState) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const reset = useCallback(() => {
    setSimLines(INITIAL_STATE);
  }, []);

  return { simLines, simResult, setSimLine, reset };
}
