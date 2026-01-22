import { useState, useMemo, createContext, useContext, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, Info, Vote, Home, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  EXCHANGE_RATE_USD_TO_MXN,
  LOAN_CONFIG,
  INVESTMENT_CONFIG,
  calculateLoanAmortization,
  calculateInvestmentReturns,
  getInvestmentBenefits,
  formatByCurrency,
  mxnToUsd,
} from '@/lib/simulatorConfig';

export type Vehicle = 'investment' | 'loan';
export type Currency = 'MXN' | 'USD';

export interface SimulatorValues {
  vehicle: Vehicle;
  amountMXN: number;
  amountUSD: number;
  currency: Currency;
}

interface PortalSimulatorProps {
  onValuesChange?: (values: SimulatorValues) => void;
}

// Currency context
const CurrencyContext = createContext<{
  currency: Currency;
  formatAmount: (amount: number, decimals?: number) => string;
}>({
  currency: 'MXN',
  formatAmount: (amount) => formatByCurrency(amount, 'MXN'),
});

const useCurrency = () => useContext(CurrencyContext);

// Currency toggle button
function CurrencyToggle({ currency, onToggle }: { currency: Currency; onToggle: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className="gap-2 h-8 px-3 text-xs font-medium"
    >
      {currency === 'MXN' ? (
        <>
          <span className="text-base">🇲🇽</span>
          MXN
        </>
      ) : (
        <>
          <span className="text-base">🇺🇸</span>
          USD
        </>
      )}
    </Button>
  );
}

export function PortalSimulator({ onValuesChange }: PortalSimulatorProps) {
  const [tab, setTab] = useState<Vehicle>('investment');
  const [currency, setCurrency] = useState<Currency>('MXN');
  const [investmentAmount, setInvestmentAmount] = useState(INVESTMENT_CONFIG.defaultAmount);
  const [loanAmount, setLoanAmount] = useState(LOAN_CONFIG.defaultAmount);

  const handleTabChange = useCallback((value: string) => {
    const vehicle = value as Vehicle;
    setTab(vehicle);
    const amountMXN = vehicle === 'investment' ? investmentAmount : loanAmount;
    onValuesChange?.({
      vehicle,
      amountMXN,
      amountUSD: mxnToUsd(amountMXN),
      currency,
    });
  }, [investmentAmount, loanAmount, currency, onValuesChange]);

  const handleInvestmentAmountChange = useCallback((value: number) => {
    setInvestmentAmount(value);
    if (tab === 'investment') {
      onValuesChange?.({
        vehicle: 'investment',
        amountMXN: value,
        amountUSD: mxnToUsd(value),
        currency,
      });
    }
  }, [tab, currency, onValuesChange]);

  const handleLoanAmountChange = useCallback((value: number) => {
    setLoanAmount(value);
    if (tab === 'loan') {
      onValuesChange?.({
        vehicle: 'loan',
        amountMXN: value,
        amountUSD: mxnToUsd(value),
        currency,
      });
    }
  }, [tab, currency, onValuesChange]);

  const toggleCurrency = () => {
    const newCurrency = currency === 'MXN' ? 'USD' : 'MXN';
    setCurrency(newCurrency);
    const amountMXN = tab === 'investment' ? investmentAmount : loanAmount;
    onValuesChange?.({
      vehicle: tab,
      amountMXN,
      amountUSD: mxnToUsd(amountMXN),
      currency: newCurrency,
    });
  };

  const formatAmount = (amount: number, decimals = 0) => {
    return formatByCurrency(amount, currency, decimals);
  };

  return (
    <CurrencyContext.Provider value={{ currency, formatAmount }}>
      <Card className="shadow-soft border-border/50 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-display">Simulador</CardTitle>
              <CardDescription>
                Calcula tu aporte y usa los valores para registrar tu transacción
              </CardDescription>
            </div>
            <CurrencyToggle currency={currency} onToggle={toggleCurrency} />
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={tab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="investment" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Inversión
              </TabsTrigger>
              <TabsTrigger value="loan" className="gap-2">
                <Wallet className="h-4 w-4" />
                Préstamo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="investment">
              <InvestmentTab 
                amount={investmentAmount} 
                onAmountChange={handleInvestmentAmountChange} 
              />
            </TabsContent>

            <TabsContent value="loan">
              <LoanTab 
                amount={loanAmount} 
                onAmountChange={handleLoanAmountChange} 
              />
            </TabsContent>
          </Tabs>

          <div className="mt-4 p-2 rounded-md bg-muted/30 border border-border/30">
            <p className="text-[10px] text-muted-foreground text-center">
              TC: 1 USD = {EXCHANGE_RATE_USD_TO_MXN} MXN • Valores informativos
            </p>
          </div>
        </CardContent>
      </Card>
    </CurrencyContext.Provider>
  );
}

interface TabProps {
  amount: number;
  onAmountChange: (value: number) => void;
}

function InvestmentTab({ amount, onAmountChange }: TabProps) {
  const { formatAmount } = useCurrency();
  
  const results = useMemo(() => calculateInvestmentReturns(amount), [amount]);
  
  const benefits = useMemo(() => {
    const benefitList = getInvestmentBenefits(amount);
    const iconMap: Record<string, typeof Users> = {
      community: Users,
      governance: Vote,
      houseAccess: Home,
    };
    return benefitList.map(b => ({ icon: iconMap[b.key] || Users, text: b.text }));
  }, [amount]);

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium">Meta de inversión</span>
          <span className="text-xs text-muted-foreground">
            {formatAmount(INVESTMENT_CONFIG.currentProgress)} / {formatAmount(INVESTMENT_CONFIG.roundGoal)}
          </span>
        </div>
        <Progress value={(INVESTMENT_CONFIG.currentProgress / INVESTMENT_CONFIG.roundGoal) * 100} className="h-1.5" />
      </div>

      {/* Amount slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm">Monto a invertir</Label>
          <span className="text-lg font-semibold text-primary">{formatAmount(amount)}</span>
        </div>
        <Slider
          min={INVESTMENT_CONFIG.minAmount}
          max={INVESTMENT_CONFIG.maxAmount}
          step={INVESTMENT_CONFIG.step}
          value={[amount]}
          onValueChange={([v]) => onAmountChange(v)}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatAmount(INVESTMENT_CONFIG.minAmount)}</span>
          <span>{formatAmount(INVESTMENT_CONFIG.maxAmount)}</span>
        </div>
      </div>

      {/* Summary */}
      <motion.div
        key={amount}
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2"
      >
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Participación en propiedad</span>
          <span className="font-medium">{results.participationPercent.toFixed(3)}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Dividendo mensual</span>
          <span className="font-medium">{formatAmount(results.monthlyDividend)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">ROI estimado (5 años)</span>
          <span className="font-semibold text-primary">{results.roi.toFixed(1)}%</span>
        </div>
      </motion.div>

      {/* Benefits */}
      {benefits.length > 0 && (
        <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
          <p className="text-xs font-medium mb-2">Beneficios incluidos:</p>
          <div className="flex flex-wrap gap-2">
            {benefits.map((b, i) => (
              <span key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                <b.icon className="h-3 w-3 text-accent" />
                {b.text}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LoanTab({ amount, onAmountChange }: TabProps) {
  const { formatAmount } = useCurrency();
  
  const result = useMemo(() => calculateLoanAmortization(amount), [amount]);
  const progressPercent = Math.min((LOAN_CONFIG.currentProgress / LOAN_CONFIG.roundGoal) * 100, 100);

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium">Meta de la ronda</span>
          <span className="text-xs text-muted-foreground">
            {formatAmount(LOAN_CONFIG.currentProgress)} / {formatAmount(LOAN_CONFIG.roundGoal)}
          </span>
        </div>
        <Progress value={progressPercent} className="h-1.5" />
      </div>

      {/* Amount slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm">Monto que prestas</Label>
          <span className="text-lg font-semibold text-secondary">{formatAmount(amount)}</span>
        </div>
        <Slider
          min={LOAN_CONFIG.minAmount}
          max={LOAN_CONFIG.maxAmount}
          step={LOAN_CONFIG.step}
          value={[amount]}
          onValueChange={([v]) => onAmountChange(v)}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatAmount(LOAN_CONFIG.minAmount)}</span>
          <span>{formatAmount(LOAN_CONFIG.maxAmount)}</span>
        </div>
      </div>

      {/* Summary */}
      <motion.div
        key={amount}
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        className="p-4 rounded-lg bg-secondary/5 border border-secondary/20 space-y-2"
      >
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Plazo máximo</span>
          <span className="font-medium">{LOAN_CONFIG.termMonths} meses</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Pago mensual promedio</span>
          <span className="font-medium">{formatAmount(result.averagePayment)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total que recibes</span>
          <span className="font-semibold text-secondary">{formatAmount(result.totalReceived)}</span>
        </div>
      </motion.div>
    </div>
  );
}
