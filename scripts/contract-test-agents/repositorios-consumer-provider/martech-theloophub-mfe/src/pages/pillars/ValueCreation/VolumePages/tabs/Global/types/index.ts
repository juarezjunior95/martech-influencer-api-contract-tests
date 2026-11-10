interface GlobalProps {
  dataTestId?: string;
}

interface UseGlobalPeriodReturn {
  monthYear: string;
  period: string;
  dt_end: string | null | undefined;
}

export type { GlobalProps, UseGlobalPeriodReturn };
