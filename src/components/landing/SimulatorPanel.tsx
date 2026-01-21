import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, Info, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInvestmentSimulator, useLoanSimulator } from '@/hooks/useSimulator';
import { formatCurrency, formatPercentage } from '@/lib/simulator';

interface SimulatorPanelProps {
  activeTab?: 'investment' | 'loan';
  onTabChange?: (tab: 'investment' | 'loan') => void;
}

export function SimulatorPanel({ activeTab = 'investment', onTabChange }: SimulatorPanelProps) {
  const [tab, setTab] = useState<string>(activeTab);

  const handleTabChange = (value: string) => {
    setTab(value);
    onTabChange?.(value as 'investment' | 'loan');
  };

  return (
    <Card className="sticky top-8 shadow-strong border-border/50 overflow-hidden">
      <div className="absolute inset-0 gradient-card" />
      <div className="relative z-10">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-display">Simulador</CardTitle>
          <CardDescription>
            Calcula tu retorno estimado sin compromiso
          </CardDescription>
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
              <InvestmentSimulator />
            </TabsContent>

            <TabsContent value="loan">
              <LoanSimulator />
            </TabsContent>
          </Tabs>

          <p className="text-xs text-muted-foreground mt-6 flex items-start gap-2">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            Los cálculos son estimados y no constituyen una promesa de rendimiento. 
            Los resultados reales pueden variar.
          </p>
        </CardContent>
      </div>
    </Card>
  );
}

function InvestmentSimulator() {
  const { 
    amount, setAmount, 
    termMonths, setTermMonths, 
    annualReturn, setAnnualReturn,
    result, reset, limits 
  } = useInvestmentSimulator();

  return (
    <div className="space-y-6">
      {/* Amount input */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="inv-amount">Monto a invertir</Label>
          <span className="text-sm font-medium text-primary">
            {formatCurrency(amount)}
          </span>
        </div>
        <Slider
          id="inv-amount"
          min={limits.minAmount}
          max={limits.maxAmount}
          step={500}
          value={[amount]}
          onValueChange={([v]) => setAmount(v)}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatCurrency(limits.minAmount)}</span>
          <span>{formatCurrency(limits.maxAmount)}</span>
        </div>
      </div>

      {/* Term input */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="inv-term">Plazo</Label>
          <span className="text-sm font-medium text-primary">
            {termMonths} meses
          </span>
        </div>
        <Slider
          id="inv-term"
          min={6}
          max={60}
          step={6}
          value={[termMonths]}
          onValueChange={([v]) => setTermMonths(v)}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>6 meses</span>
          <span>60 meses</span>
        </div>
      </div>

      {/* Return rate input */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="inv-return">Retorno anual estimado</Label>
          <span className="text-sm font-medium text-primary">
            {formatPercentage(annualReturn)}
          </span>
        </div>
        <Slider
          id="inv-return"
          min={5}
          max={20}
          step={0.5}
          value={[annualReturn]}
          onValueChange={([v]) => setAnnualReturn(v)}
        />
      </div>

      {/* Results */}
      <motion.div
        key={`${amount}-${termMonths}-${annualReturn}`}
        initial={{ opacity: 0.8, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-5 rounded-xl bg-primary/5 border border-primary/20 space-y-4"
      >
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Capital inicial</span>
          <span className="font-semibold">{formatCurrency(result.initialAmount)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Ganancia estimada</span>
          <span className="font-semibold text-secondary">+{formatCurrency(result.totalProfit)}</span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex justify-between items-center">
          <span className="font-medium">Total al vencimiento</span>
          <span className="text-2xl font-display font-bold text-primary">
            {formatCurrency(result.totalReturn)}
          </span>
        </div>
      </motion.div>

      <Button variant="ghost" size="sm" onClick={reset} className="w-full gap-2">
        <RefreshCw className="h-4 w-4" />
        Restablecer valores
      </Button>
    </div>
  );
}

function LoanSimulator() {
  const { 
    amount, setAmount, 
    termMonths, setTermMonths, 
    interestRate, setInterestRate,
    result, reset, limits 
  } = useLoanSimulator();

  return (
    <div className="space-y-6">
      {/* Amount input */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="loan-amount">Monto del préstamo</Label>
          <span className="text-sm font-medium text-primary">
            {formatCurrency(amount)}
          </span>
        </div>
        <Slider
          id="loan-amount"
          min={limits.minAmount}
          max={limits.maxAmount}
          step={1000}
          value={[amount]}
          onValueChange={([v]) => setAmount(v)}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatCurrency(limits.minAmount)}</span>
          <span>{formatCurrency(limits.maxAmount)}</span>
        </div>
      </div>

      {/* Term input */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="loan-term">Plazo</Label>
          <span className="text-sm font-medium text-primary">
            {termMonths} meses
          </span>
        </div>
        <Slider
          id="loan-term"
          min={12}
          max={72}
          step={6}
          value={[termMonths]}
          onValueChange={([v]) => setTermMonths(v)}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>12 meses</span>
          <span>72 meses</span>
        </div>
      </div>

      {/* Interest rate */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="loan-rate">Tasa de interés anual</Label>
          <span className="text-sm font-medium text-primary">
            {formatPercentage(interestRate)}
          </span>
        </div>
        <Slider
          id="loan-rate"
          min={4}
          max={15}
          step={0.5}
          value={[interestRate]}
          onValueChange={([v]) => setInterestRate(v)}
        />
      </div>

      {/* Results */}
      <motion.div
        key={`${amount}-${termMonths}-${interestRate}`}
        initial={{ opacity: 0.8, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-5 rounded-xl bg-secondary/5 border border-secondary/20 space-y-4"
      >
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Monto del préstamo</span>
          <span className="font-semibold">{formatCurrency(result.loanAmount)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Intereses totales</span>
          <span className="font-semibold text-muted-foreground">{formatCurrency(result.totalInterest)}</span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex justify-between items-center">
          <span className="font-medium">Pago mensual</span>
          <span className="text-2xl font-display font-bold text-secondary">
            {formatCurrency(result.monthlyPayment)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Total a pagar: {formatCurrency(result.totalPayment)} en {termMonths} meses
        </p>
      </motion.div>

      <Button variant="ghost" size="sm" onClick={reset} className="w-full gap-2">
        <RefreshCw className="h-4 w-4" />
        Restablecer valores
      </Button>
    </div>
  );
}
