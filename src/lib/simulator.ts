// Simulator logic - deterministic, decoupled from UI
// This module handles all investment and loan calculations

export interface InvestmentSimulationInput {
  amount: number; // in crypto dollars
  termMonths: number;
  estimatedAnnualReturn: number; // percentage (e.g., 12 for 12%)
}

export interface InvestmentSimulationResult {
  initialAmount: number;
  termMonths: number;
  annualReturnRate: number;
  monthlyReturnRate: number;
  totalReturn: number;
  totalProfit: number;
  monthlyBreakdown: MonthlyBreakdown[];
}

export interface LoanSimulationInput {
  amount: number; // in crypto dollars
  termMonths: number;
  annualInterestRate: number; // percentage
}

export interface LoanSimulationResult {
  loanAmount: number;
  termMonths: number;
  annualInterestRate: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  monthlyBreakdown: LoanMonthlyBreakdown[];
}

interface MonthlyBreakdown {
  month: number;
  startBalance: number;
  interest: number;
  endBalance: number;
}

interface LoanMonthlyBreakdown {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

/**
 * Simulates an investment with compound interest
 * Uses monthly compounding for more accurate results
 */
export function simulateInvestment(input: InvestmentSimulationInput): InvestmentSimulationResult {
  const { amount, termMonths, estimatedAnnualReturn } = input;
  
  const monthlyRate = estimatedAnnualReturn / 100 / 12;
  const monthlyBreakdown: MonthlyBreakdown[] = [];
  
  let balance = amount;
  
  for (let month = 1; month <= termMonths; month++) {
    const startBalance = balance;
    const interest = balance * monthlyRate;
    balance = balance + interest;
    
    monthlyBreakdown.push({
      month,
      startBalance: Math.round(startBalance * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      endBalance: Math.round(balance * 100) / 100,
    });
  }
  
  const totalReturn = Math.round(balance * 100) / 100;
  const totalProfit = Math.round((balance - amount) * 100) / 100;
  
  return {
    initialAmount: amount,
    termMonths,
    annualReturnRate: estimatedAnnualReturn,
    monthlyReturnRate: Math.round(monthlyRate * 10000) / 100,
    totalReturn,
    totalProfit,
    monthlyBreakdown,
  };
}

/**
 * Simulates a loan with fixed monthly payments (amortization)
 * Uses standard amortization formula
 */
export function simulateLoan(input: LoanSimulationInput): LoanSimulationResult {
  const { amount, termMonths, annualInterestRate } = input;
  
  const monthlyRate = annualInterestRate / 100 / 12;
  
  // Monthly payment formula: P * [r(1+r)^n] / [(1+r)^n - 1]
  let monthlyPayment: number;
  
  if (monthlyRate === 0) {
    monthlyPayment = amount / termMonths;
  } else {
    const compoundFactor = Math.pow(1 + monthlyRate, termMonths);
    monthlyPayment = amount * (monthlyRate * compoundFactor) / (compoundFactor - 1);
  }
  
  monthlyPayment = Math.round(monthlyPayment * 100) / 100;
  
  const monthlyBreakdown: LoanMonthlyBreakdown[] = [];
  let remainingBalance = amount;
  let totalInterestPaid = 0;
  
  for (let month = 1; month <= termMonths; month++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingBalance = Math.max(0, remainingBalance - principalPayment);
    totalInterestPaid += interestPayment;
    
    monthlyBreakdown.push({
      month,
      payment: monthlyPayment,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interestPayment * 100) / 100,
      remainingBalance: Math.round(remainingBalance * 100) / 100,
    });
  }
  
  return {
    loanAmount: amount,
    termMonths,
    annualInterestRate,
    monthlyPayment,
    totalPayment: Math.round(monthlyPayment * termMonths * 100) / 100,
    totalInterest: Math.round(totalInterestPaid * 100) / 100,
    monthlyBreakdown,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}
