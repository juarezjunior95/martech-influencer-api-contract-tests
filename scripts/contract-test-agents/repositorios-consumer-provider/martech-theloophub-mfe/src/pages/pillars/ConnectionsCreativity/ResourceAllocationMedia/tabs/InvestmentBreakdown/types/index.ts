export interface InvestmentGroupRange {
  initial: number;
  final: number;
}

export interface InvestmentGroupMap {
  [portfolio: string]: InvestmentGroupRange;
}
