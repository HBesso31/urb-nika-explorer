import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  EXCHANGE_RATE_USD_TO_MXN,
  LOAN_CONFIG,
  INVESTMENT_CONFIG,
  calculateLoanAmortization,
  calculateInvestmentReturns,
  formatMXN,
  formatUSD,
  mxnToUsd,
} from '@/lib/simulatorConfig';

export type Vehicle = 'investment' | 'loan';
export type Currency = 'MXN' | 'USD';

export interface ContributionValues {
  vehicle: Vehicle;
  amountMXN: number;
  amountUSD: number;
  currency: Currency;
}

interface ContributionSummaryProps {
  onAportar: (values: ContributionValues) => void;
}

export function ContributionSummary({ onAportar }: ContributionSummaryProps) {
  const [vehicle, setVehicle] = useState<Vehicle>('investment');
  const [currency, setCurrency] = useState<Currency>('MXN');
  const [amount, setAmount] = useState(
    vehicle === 'investment' ? INVESTMENT_CONFIG.defaultAmount : LOAN_CONFIG.defaultAmount
  );

  const config = vehicle === 'investment' ? INVESTMENT_CONFIG : LOAN_CONFIG;

  const handleVehicleChange = useCallback((newVehicle: Vehicle) => {
    setVehicle(newVehicle);
    // Reset amount to default for the new vehicle
    setAmount(newVehicle === 'investment' ? INVESTMENT_CONFIG.defaultAmount : LOAN_CONFIG.defaultAmount);
  }, []);

  const toggleCurrency = () => {
    setCurrency(prev => prev === 'MXN' ? 'USD' : 'MXN');
  };

  const formatAmount = (value: number) => {
    return currency === 'MXN' ? formatMXN(value) : formatUSD(mxnToUsd(value));
  };

  // Investment calculations
  const investmentResults = useMemo(() => {
    if (vehicle !== 'investment') return null;
    return calculateInvestmentReturns(amount);
  }, [vehicle, amount]);

  // Loan calculations
  const loanResults = useMemo(() => {
    if (vehicle !== 'loan') return null;
    return calculateLoanAmortization(amount);
  }, [vehicle, amount]);

  const handleAportar = () => {
    onAportar({
      vehicle,
      amountMXN: amount,
      amountUSD: mxnToUsd(amount),
      currency,
    });
  };

  return (
    <Card className="shadow-soft border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-display">Resumen de tu aporte</CardTitle>
        <CardDescription>
          Elige tu vehículo de participación y monto
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Vehicle Toggle */}
        <div className="flex gap-2">
          <Button
            variant={vehicle === 'investment' ? 'default' : 'outline'}
            className="flex-1 gap-2"
            onClick={() => handleVehicleChange('investment')}
          >
            <TrendingUp className="h-4 w-4" />
            Inversión
          </Button>
          <Button
            variant={vehicle === 'loan' ? 'default' : 'outline'}
            className="flex-1 gap-2"
            onClick={() => handleVehicleChange('loan')}
          >
            <Wallet className="h-4 w-4" />
            Préstamo
          </Button>
        </div>

        {/* Amount Input with Currency Toggle */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-sm">Monto</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleCurrency}
                className="h-7 px-2 text-xs"
              >
                {currency === 'MXN' ? '🇲🇽 MXN' : '🇺🇸 USD'}
              </Button>
              <span className="text-lg font-semibold text-primary">{formatAmount(amount)}</span>
            </div>
          </div>
          <Slider
            min={config.minAmount}
            max={config.maxAmount}
            step={config.step}
            value={[amount]}
            onValueChange={([v]) => setAmount(v)}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatAmount(config.minAmount)}</span>
            <span>{formatAmount(config.maxAmount)}</span>
          </div>
          {currency === 'MXN' && (
            <p className="text-xs text-muted-foreground text-center">
              ≈ {formatUSD(mxnToUsd(amount))} (TC: {EXCHANGE_RATE_USD_TO_MXN} MXN/USD)
            </p>
          )}
          {currency === 'USD' && (
            <p className="text-xs text-muted-foreground text-center">
              ≈ {formatMXN(amount)} (TC: {EXCHANGE_RATE_USD_TO_MXN} MXN/USD)
            </p>
          )}
        </div>

        {/* Results Summary */}
        <motion.div
          key={`${vehicle}-${amount}`}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          className={`p-4 rounded-lg space-y-3 ${
            vehicle === 'investment' 
              ? 'bg-primary/5 border border-primary/20' 
              : 'bg-secondary/5 border border-secondary/20'
          }`}
        >
          {vehicle === 'investment' && investmentResults && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Participación estimada</span>
                <span className="font-medium">{investmentResults.participationPercent.toFixed(3)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dividendo mensual por renta</span>
                <span className="font-medium">{formatAmount(investmentResults.monthlyDividend)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ganancia estimada (5 años)</span>
                <span className="font-medium">{formatAmount(investmentResults.saleProfit)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-border/50 pt-2">
                <span className="text-muted-foreground">Ganancias totales estimadas</span>
                <span className="font-semibold text-primary">{formatAmount(investmentResults.totalGains)}</span>
              </div>
            </>
          )}

          {vehicle === 'loan' && loanResults && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plazo</span>
                <span className="font-medium">{LOAN_CONFIG.termMonths} meses</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tasa anual</span>
                <span className="font-medium">{(LOAN_CONFIG.annualRate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pago mensual promedio</span>
                <span className="font-medium">{formatAmount(loanResults.averagePayment)}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-border/50 pt-2">
                <span className="text-muted-foreground">Total que recibes</span>
                <span className="font-semibold text-secondary">{formatAmount(loanResults.totalReceived)}</span>
              </div>
            </>
          )}
        </motion.div>

        {/* Aportar Button */}
        <Button 
          className="w-full gap-2" 
          size="lg"
          onClick={handleAportar}
        >
          Aportar
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
