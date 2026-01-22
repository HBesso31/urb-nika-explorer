// Simulator configuration with real values from "Simuladores para levantar capital"
// This file serves as the single source of truth for all simulator calculations

// ===============================
// EXCHANGE RATE CONFIGURATION
// ===============================
// Exchange rate as of January 21, 2026 (configurable - update manually)
export const EXCHANGE_RATE_USD_TO_MXN = 17.59;

// ===============================
// LOAN SIMULATOR CONFIGURATION
// ===============================
export const LOAN_CONFIG = {
  // Round goal and progress
  roundGoal: 750000, // $750,000 MXN total needed
  progressPercent: 33, // 33% completed
  get currentProgress() { return this.roundGoal * (this.progressPercent / 100); }, // $247,500 MXN
  
  // Slider limits (MXN)
  minAmount: 5000,
  maxAmount: 750000, // Allow up to full goal
  defaultAmount: 25000,
  step: 5000,
  
  // Loan terms
  annualRate: 12, // 12% annual rate
  termMonths: 48, // 48 month term
  monthlyCapitalPayment: 15625, // Fixed capital per month ($750k / 48 months)
};

// ===============================
// INVESTMENT SIMULATOR CONFIGURATION
// ===============================
export const INVESTMENT_CONFIG = {
  // Round goal and progress
  roundGoal: 1150000, // $1,150,000 MXN investment needed
  progressPercent: 7, // 7% completed
  get currentProgress() { return this.roundGoal * (this.progressPercent / 100); }, // $80,500 MXN
  
  // Slider limits (MXN) - max allows reaching full goal
  minAmount: 10000,
  maxAmount: 1150000, // Allow up to full goal
  defaultAmount: 50000,
  step: 10000,
  
  // Property values
  propertyValue2026: 6500000, // $6,500,000 MXN estimated value in 2026
  propertyValue2031: 11375000, // $11,375,000 MXN estimated value in 2031
  appreciationRate: 0.75, // 75% appreciation over 5 years
  
  // Rental income
  monthlyRentGross: 25000, // $25,000 MXN gross rent
  monthlyRentNet: 23000, // $23,000 MXN net rent (after admin, maintenance, taxes)
  
  // Investment period
  investmentHorizonYears: 5,
  
  // Benefit thresholds (MXN)
  benefitThresholds: {
    community: 10000, // Access to exclusive community
    governance: 50000, // Voice and vote in decisions
    houseAccess: 100000, // Access to stay at the house
  },
};

// ===============================
// CALCULATION FUNCTIONS
// ===============================

/**
 * Calculate loan amortization using the Linear Decreasing Model
 * Based on the Excel "Simuladores para levantar capital"
 * Fund payment decreases linearly from $23,125 (month 1) to $482 (month 48)
 */
export function calculateLoanAmortization(loanAmount: number) {
  const { termMonths, roundGoal } = LOAN_CONFIG;
  
  // User's participation percentage in the fund
  const participationPercent = loanAmount / roundGoal;
  
  // Excel model: Linear decreasing fund payments
  // Month 1: $23,125, Month 48: $482
  const FIRST_FUND_PAYMENT = 23125;
  const LAST_FUND_PAYMENT = 482;
  const monthlyDecrease = (FIRST_FUND_PAYMENT - LAST_FUND_PAYMENT) / (termMonths - 1);
  
  let totalUserPayment = 0;
  const schedule: { month: number; payment: number; fundPayment: number }[] = [];
  
  for (let month = 1; month <= termMonths; month++) {
    // Fund payment decreases linearly each month
    const fundPayment = FIRST_FUND_PAYMENT - (month - 1) * monthlyDecrease;
    
    // User's payment = their % of the fund's payment
    const userPayment = fundPayment * participationPercent;
    totalUserPayment += userPayment;
    
    schedule.push({
      month,
      payment: Math.round(userPayment * 100) / 100,
      fundPayment: Math.round(fundPayment * 100) / 100,
    });
  }
  
  const averagePayment = totalUserPayment / termMonths;
  const totalInterest = totalUserPayment - loanAmount;
  
  // Total received = principal + interest earned
  const totalReceived = loanAmount + totalInterest;
  
  return {
    loanAmount,
    participationPercent: participationPercent * 100, // As percentage for UI
    firstMonthPayment: schedule[0]?.payment || 0,
    lastMonthPayment: schedule[termMonths - 1]?.payment || 0,
    averagePayment: Math.round(averagePayment * 100) / 100,
    totalPayment: Math.round(totalUserPayment * 100) / 100,
    totalReceived: Math.round(totalReceived * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    schedule,
  };
}

/**
 * Calculate investment returns based on participation percentage
 */
export function calculateInvestmentReturns(investmentAmount: number) {
  const { 
    propertyValue2026, 
    propertyValue2031, 
    monthlyRentNet, 
    investmentHorizonYears,
    roundGoal,
  } = INVESTMENT_CONFIG;
  
  // Participation percentage based on property value
  const participationPercent = investmentAmount / propertyValue2026;
  
  // Monthly dividend from rent
  const monthlyDividend = monthlyRentNet * participationPercent;
  
  // Annual dividend
  const annualDividend = monthlyDividend * 12;
  
  // Total dividends over investment horizon
  const totalDividends = annualDividend * investmentHorizonYears;
  
  // Capital appreciation at sale (after 5 years)
  const appreciationValue = propertyValue2031 - propertyValue2026;
  const saleProfit = appreciationValue * participationPercent;
  
  // Total gains (dividends + sale profit)
  const totalGains = totalDividends + saleProfit;
  
  // ROI calculation
  const roi = (totalGains / investmentAmount) * 100;
  const roiMonths = investmentAmount / monthlyDividend;
  
  // Contribution to round
  const roundContributionPercent = (investmentAmount / roundGoal) * 100;
  
  return {
    investmentAmount,
    participationPercent: participationPercent * 100,
    monthlyDividend: Math.round(monthlyDividend * 100) / 100,
    annualDividend: Math.round(annualDividend * 100) / 100,
    totalDividends: Math.round(totalDividends * 100) / 100,
    saleProfit: Math.round(saleProfit * 100) / 100,
    totalGains: Math.round(totalGains * 100) / 100,
    roi: Math.round(roi * 100) / 100,
    roiMonths: Math.round(roiMonths * 10) / 10,
    roundContributionPercent: Math.round(roundContributionPercent * 100) / 100,
  };
}

/**
 * Get applicable benefits based on investment amount
 */
export function getInvestmentBenefits(amount: number) {
  const { benefitThresholds } = INVESTMENT_CONFIG;
  const benefits = [];
  
  if (amount >= benefitThresholds.community) {
    benefits.push({ key: 'community', text: 'Comunidad exclusiva' });
  }
  if (amount >= benefitThresholds.governance) {
    benefits.push({ key: 'governance', text: 'Voz y voto en decisiones' });
  }
  if (amount >= benefitThresholds.houseAccess) {
    benefits.push({ key: 'houseAccess', text: 'Acceso a la casa' });
  }
  
  return benefits;
}

/**
 * Format currency with proper locale
 */
export function formatMXN(amount: number, decimals = 0): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function formatUSD(amount: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Convert MXN to USD
 */
export function mxnToUsd(amountMXN: number): number {
  return amountMXN / EXCHANGE_RATE_USD_TO_MXN;
}

/**
 * Format amount based on currency selection
 */
export function formatByCurrency(amountMXN: number, currency: 'MXN' | 'USD', decimals = 0): string {
  if (currency === 'USD') {
    return formatUSD(mxnToUsd(amountMXN), decimals);
  }
  return formatMXN(amountMXN, decimals);
}
