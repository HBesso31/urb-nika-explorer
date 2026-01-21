// Simulator logic V2 - with scenarios and ranges
// This module handles investment and loan calculations with conservative/base/optimistic scenarios

export type Scenario = 'conservative' | 'base' | 'optimistic';

export interface ScenarioRates {
  conservative: number;
  base: number;
  optimistic: number;
}

// Configurable annual return rates by scenario
export const investmentRates: ScenarioRates = {
  conservative: 8,
  base: 12,
  optimistic: 18,
};

// Configurable loan interest rates by scenario
export const loanRates: ScenarioRates = {
  conservative: 10,
  base: 8,
  optimistic: 6,
};

export interface InvestmentSimulationInputV2 {
  amount: number;
  termMonths: number;
  scenario: Scenario;
}

export interface InvestmentSimulationResultV2 {
  initialAmount: number;
  termMonths: number;
  scenario: Scenario;
  annualReturnRate: number;
  totalReturn: number;
  totalProfit: number;
  rangeMin: number;
  rangeMax: number;
  monthlyFlow: number;
}

export interface LoanSimulationInputV2 {
  amount: number;
  termMonths: number;
  scenario: Scenario;
}

export interface LoanSimulationResultV2 {
  loanAmount: number;
  termMonths: number;
  scenario: Scenario;
  annualInterestRate: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  rangeMin: number;
  rangeMax: number;
}

/**
 * Calculate compound interest return
 */
function calculateReturn(principal: number, annualRate: number, months: number): number {
  const monthlyRate = annualRate / 100 / 12;
  return principal * Math.pow(1 + monthlyRate, months);
}

/**
 * Calculate monthly payment for loan amortization
 */
function calculateMonthlyPayment(principal: number, annualRate: number, months: number): number {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  const compoundFactor = Math.pow(1 + monthlyRate, months);
  return principal * (monthlyRate * compoundFactor) / (compoundFactor - 1);
}

/**
 * Simulates an investment with scenario-based rates
 */
export function simulateInvestmentV2(input: InvestmentSimulationInputV2): InvestmentSimulationResultV2 {
  const { amount, termMonths, scenario } = input;
  
  const annualRate = investmentRates[scenario];
  const totalReturn = calculateReturn(amount, annualRate, termMonths);
  const totalProfit = totalReturn - amount;
  
  // Calculate range based on all scenarios
  const rangeMin = calculateReturn(amount, investmentRates.conservative, termMonths) - amount;
  const rangeMax = calculateReturn(amount, investmentRates.optimistic, termMonths) - amount;
  
  // Monthly flow (simplified: average profit per month)
  const monthlyFlow = totalProfit / termMonths;
  
  return {
    initialAmount: amount,
    termMonths,
    scenario,
    annualReturnRate: annualRate,
    totalReturn: Math.round(totalReturn * 100) / 100,
    totalProfit: Math.round(totalProfit * 100) / 100,
    rangeMin: Math.round(rangeMin * 100) / 100,
    rangeMax: Math.round(rangeMax * 100) / 100,
    monthlyFlow: Math.round(monthlyFlow * 100) / 100,
  };
}

/**
 * Simulates a loan with scenario-based rates
 */
export function simulateLoanV2(input: LoanSimulationInputV2): LoanSimulationResultV2 {
  const { amount, termMonths, scenario } = input;
  
  const annualRate = loanRates[scenario];
  const monthlyPayment = calculateMonthlyPayment(amount, annualRate, termMonths);
  const totalPayment = monthlyPayment * termMonths;
  const totalInterest = totalPayment - amount;
  
  // Calculate range based on all scenarios
  const paymentConservative = calculateMonthlyPayment(amount, loanRates.conservative, termMonths);
  const paymentOptimistic = calculateMonthlyPayment(amount, loanRates.optimistic, termMonths);
  
  return {
    loanAmount: amount,
    termMonths,
    scenario,
    annualInterestRate: annualRate,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    rangeMin: Math.round(paymentOptimistic * 100) / 100,
    rangeMax: Math.round(paymentConservative * 100) / 100,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Get scenario label in Spanish
 */
export function getScenarioLabel(scenario: Scenario): string {
  const labels: Record<Scenario, string> = {
    conservative: 'Conservador',
    base: 'Base',
    optimistic: 'Optimista',
  };
  return labels[scenario];
}
