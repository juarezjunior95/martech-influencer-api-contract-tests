interface Portfolio {
  title: string;
  subtitle: string;
}

interface PerformanceMetric {
  value: number;
  comparison: string;
  measure: string;
  variationDirection: string;
}

export interface PortfolioPerformanceFooter {
  portfolio: Portfolio;
  month: PerformanceMetric;
  l3m: PerformanceMetric;
  ytd: PerformanceMetric;
}
