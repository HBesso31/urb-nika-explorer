import { useState, useMemo, useCallback } from 'react';
import { 
  simulateInvestment, 
  simulateLoan, 
  InvestmentSimulationInput, 
  InvestmentSimulationResult,
  LoanSimulationInput,
  LoanSimulationResult 
} from '@/lib/simulator';
import { simulatorDefaults } from '@/lib/projectAssets';

export function useInvestmentSimulator() {
  const [amount, setAmount] = useState(simulatorDefaults.investment.defaultAmount);
  const [termMonths, setTermMonths] = useState(simulatorDefaults.investment.defaultTerm);
  const [annualReturn, setAnnualReturn] = useState(simulatorDefaults.investment.estimatedAnnualReturn);

  const result = useMemo<InvestmentSimulationResult>(() => {
    const input: InvestmentSimulationInput = {
      amount,
      termMonths,
      estimatedAnnualReturn: annualReturn,
    };
    return simulateInvestment(input);
  }, [amount, termMonths, annualReturn]);

  const reset = useCallback(() => {
    setAmount(simulatorDefaults.investment.defaultAmount);
    setTermMonths(simulatorDefaults.investment.defaultTerm);
    setAnnualReturn(simulatorDefaults.investment.estimatedAnnualReturn);
  }, []);

  return {
    amount,
    setAmount,
    termMonths,
    setTermMonths,
    annualReturn,
    setAnnualReturn,
    result,
    reset,
    limits: {
      minAmount: simulatorDefaults.investment.minAmount,
      maxAmount: simulatorDefaults.investment.maxAmount,
    },
  };
}

export function useLoanSimulator() {
  const [amount, setAmount] = useState(simulatorDefaults.loan.defaultAmount);
  const [termMonths, setTermMonths] = useState(simulatorDefaults.loan.defaultTerm);
  const [interestRate, setInterestRate] = useState(simulatorDefaults.loan.annualInterestRate);

  const result = useMemo<LoanSimulationResult>(() => {
    const input: LoanSimulationInput = {
      amount,
      termMonths,
      annualInterestRate: interestRate,
    };
    return simulateLoan(input);
  }, [amount, termMonths, interestRate]);

  const reset = useCallback(() => {
    setAmount(simulatorDefaults.loan.defaultAmount);
    setTermMonths(simulatorDefaults.loan.defaultTerm);
    setInterestRate(simulatorDefaults.loan.annualInterestRate);
  }, []);

  return {
    amount,
    setAmount,
    termMonths,
    setTermMonths,
    interestRate,
    setInterestRate,
    result,
    reset,
    limits: {
      minAmount: simulatorDefaults.loan.minAmount,
      maxAmount: simulatorDefaults.loan.maxAmount,
    },
  };
}
