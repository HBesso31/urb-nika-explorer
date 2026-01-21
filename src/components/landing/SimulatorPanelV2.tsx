import { useState, useMemo, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, Info, ArrowRight, Loader2, ArrowDown, RefreshCw, CheckCircle2, Vote, Home, Users } from 'lucide-react';
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
} from '@/lib/simulatorConfig';
import { useAuth } from '@/hooks/useAuth';
import { useParticipations, CreateParticipationInput } from '@/hooks/useParticipations';
import { toast } from 'sonner';

interface SimulatorPanelV2Props {
  activeTab?: 'investment' | 'loan';
  onTabChange?: (tab: 'investment' | 'loan') => void;
}

type Currency = 'MXN' | 'USD';

// Currency context to share between components
const CurrencyContext = createContext<{
  currency: Currency;
  formatAmount: (amount: number, decimals?: number) => string;
}>({
  currency: 'MXN',
  formatAmount: (amount) => formatByCurrency(amount, 'MXN'),
});

const useCurrency = () => useContext(CurrencyContext);

// Currency toggle button component
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

export function SimulatorPanelV2({ activeTab = 'investment', onTabChange }: SimulatorPanelV2Props) {
  const [tab, setTab] = useState<string>(activeTab);
  const [currency, setCurrency] = useState<Currency>('MXN');

  // Sync internal state when parent changes activeTab
  useEffect(() => {
    setTab(activeTab);
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setTab(value);
    onTabChange?.(value as 'investment' | 'loan');
  };

  const toggleCurrency = () => {
    setCurrency(prev => prev === 'MXN' ? 'USD' : 'MXN');
  };

  const formatAmount = (amount: number, decimals = 0) => {
    return formatByCurrency(amount, currency, decimals);
  };

  return (
    <CurrencyContext.Provider value={{ currency, formatAmount }}>
      <Card className="sticky top-8 shadow-strong border-border/50 overflow-hidden lg:max-h-[calc(100vh-120px)] flex flex-col">
        <div className="absolute inset-0 gradient-card" />
        <div className="relative z-10 flex flex-col min-h-0">
          <CardHeader className="pb-4 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-display">Simulador</CardTitle>
                <CardDescription>
                  Calcula tu retorno estimado y declara tu intención
                </CardDescription>
              </div>
              <CurrencyToggle currency={currency} onToggle={toggleCurrency} />
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto min-h-0">
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
                <InvestmentSimulatorV2 />
              </TabsContent>

              <TabsContent value="loan">
                <LoanSimulatorV2 />
              </TabsContent>
            </Tabs>

            {/* Exchange rate disclaimer */}
            <div className="mt-4 p-2 rounded-md bg-muted/30 border border-border/30">
              <p className="text-[10px] text-muted-foreground text-center">
                TC: 1 USD = {EXCHANGE_RATE_USD_TO_MXN} MXN • Valores actualizables al tipo de cambio del día. Los montos mostrados son informativos.
              </p>
            </div>

            <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border/50">
              <p className="text-xs text-muted-foreground flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                Esta es una simulación informativa, no una oferta de valores. Los rendimientos 
                son estimados y pueden variar según las condiciones del mercado.
              </p>
            </div>
          </CardContent>
        </div>
      </Card>
    </CurrencyContext.Provider>
  );
}

function InvestmentSimulatorV2() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createParticipation } = useParticipations();
  const { formatAmount } = useCurrency();
  
  const [amount, setAmount] = useState(INVESTMENT_CONFIG.defaultAmount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate real investment returns
  const results = useMemo(() => {
    return calculateInvestmentReturns(amount);
  }, [amount]);

  // Get applicable benefits
  const benefits = useMemo(() => {
    const benefitList = getInvestmentBenefits(amount);
    const iconMap: Record<string, typeof Users> = {
      community: Users,
      governance: Vote,
      houseAccess: Home,
    };
    return benefitList.map(b => ({ icon: iconMap[b.key] || Users, text: b.text }));
  }, [amount]);

  const handleDeclareIntent = async () => {
    if (!user) {
      navigate('/auth?mode=register&intent=investment');
      return;
    }

    setIsSubmitting(true);
    const input: CreateParticipationInput = {
      type: 'investment',
      amount,
      termMonths: INVESTMENT_CONFIG.investmentHorizonYears * 12,
      scenario: 'base',
    };

    const { error } = await createParticipation(input);
    setIsSubmitting(false);

    if (error) {
      toast.error('Error al registrar intención', { description: error });
      return;
    }

    toast.success('¡Intención registrada!', { 
      description: 'Puedes ver tu participación en el portal.' 
    });
    navigate('/portal');
  };

  return (
    <div className="space-y-6">
      {/* Round progress */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">Meta de inversión</span>
          <span className="text-sm text-muted-foreground">
            {formatAmount(INVESTMENT_CONFIG.currentProgress)} / {formatAmount(INVESTMENT_CONFIG.roundGoal)}
          </span>
        </div>
        <Progress value={(INVESTMENT_CONFIG.currentProgress / INVESTMENT_CONFIG.roundGoal) * 100} className="h-2 mb-2" />
        <p className="text-xs text-muted-foreground">
          {((INVESTMENT_CONFIG.currentProgress / INVESTMENT_CONFIG.roundGoal) * 100).toFixed(0)}% completado
        </p>
      </div>

      {/* Amount */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label>Monto a invertir</Label>
          <span className="text-lg font-semibold text-primary">
            {formatAmount(amount)}
          </span>
        </div>
        <Slider
          min={INVESTMENT_CONFIG.minAmount}
          max={INVESTMENT_CONFIG.maxAmount}
          step={INVESTMENT_CONFIG.step}
          value={[amount]}
          onValueChange={([v]) => setAmount(v)}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatAmount(INVESTMENT_CONFIG.minAmount)}</span>
          <span>{formatAmount(INVESTMENT_CONFIG.maxAmount)}</span>
        </div>
      </div>

      {/* Results */}
      <motion.div
        key={amount}
        initial={{ opacity: 0.8, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-5 rounded-xl bg-primary/5 border border-primary/20 space-y-3"
      >
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Participación en propiedad</span>
          <span className="font-semibold">{results.participationPercent.toFixed(3)}%</span>
        </div>
        <div className="h-px bg-border" />
        
        <div>
          <p className="text-sm text-muted-foreground mb-1">Dividendo mensual por renta</p>
          <p className="text-lg font-semibold text-foreground">
            {formatAmount(results.monthlyDividend)}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-1">Ganancia estimada a la venta (5 años)</p>
          <p className="text-lg font-semibold text-secondary">
            +{formatAmount(results.saleProfit)}
          </p>
        </div>

        <div className="h-px bg-border" />
        
        <div className="flex justify-between items-center">
          <span className="font-medium">Ganancias totales estimadas</span>
          <span className="text-xl font-display font-bold text-primary">
            +{formatAmount(results.totalGains)}
          </span>
        </div>

        <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
          ROI: {results.roi.toFixed(1)}% • Recuperación: ~{Math.round(results.roiMonths)} meses
        </p>
      </motion.div>

      {/* Non-financial benefits */}
      {benefits.length > 0 && (
        <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
          <p className="text-sm font-medium text-foreground mb-2">Beneficios incluidos:</p>
          <div className="space-y-2">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <benefit.icon className="h-4 w-4 text-accent" />
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contribution message */}
      <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-center">
        <p className="text-sm text-foreground">
          Aportarías el <span className="font-semibold text-accent">{results.roundContributionPercent.toFixed(1)}%</span> de la meta de inversión
        </p>
      </div>

      {/* CTA */}
      <Button 
        variant="hero" 
        size="lg" 
        className="w-full group"
        onClick={handleDeclareIntent}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registrando...
          </>
        ) : (
          <>
            {user ? 'Declarar intención' : 'Regístrate para participar'}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </div>
  );
}

function LoanSimulatorV2() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createParticipation } = useParticipations();
  const { formatAmount } = useCurrency();
  
  const [amount, setAmount] = useState(LOAN_CONFIG.defaultAmount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate real amortization with decreasing interest
  const result = useMemo(() => {
    return calculateLoanAmortization(amount);
  }, [amount]);

  // Calculate progress toward loan round goal
  const progressPercent = Math.min((LOAN_CONFIG.currentProgress / LOAN_CONFIG.roundGoal) * 100, 100);

  const handleDeclareIntent = async () => {
    if (!user) {
      navigate('/auth?mode=register&intent=loan');
      return;
    }

    setIsSubmitting(true);
    const input: CreateParticipationInput = {
      type: 'loan',
      amount,
      termMonths: LOAN_CONFIG.termMonths,
      scenario: 'base',
    };

    const { error } = await createParticipation(input);
    setIsSubmitting(false);

    if (error) {
      toast.error('Error al registrar intención', { description: error });
      return;
    }

    toast.success('¡Intención registrada!', { 
      description: 'Puedes ver tu participación en el portal.' 
    });
    navigate('/portal');
  };

  return (
    <div className="space-y-6">
      {/* Progress toward goal */}
      <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">Meta de la ronda</span>
          <span className="text-sm text-muted-foreground">
            {formatAmount(LOAN_CONFIG.currentProgress)} / {formatAmount(LOAN_CONFIG.roundGoal)}
          </span>
        </div>
        <Progress value={progressPercent} className="h-2 mb-2" />
        <p className="text-xs text-muted-foreground">
          {progressPercent.toFixed(0)}% completado
        </p>
      </div>

      {/* Amount */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label>Monto que prestas</Label>
          <span className="text-lg font-semibold text-secondary">
            {formatAmount(amount)}
          </span>
        </div>
        <Slider
          min={LOAN_CONFIG.minAmount}
          max={LOAN_CONFIG.maxAmount}
          step={LOAN_CONFIG.step}
          value={[amount]}
          onValueChange={([v]) => setAmount(v)}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatAmount(LOAN_CONFIG.minAmount)}</span>
          <span>{formatAmount(LOAN_CONFIG.maxAmount)}</span>
        </div>
      </div>

      {/* Visual flow explanation */}
      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
        <p className="text-sm font-medium text-foreground mb-3">¿Cómo funciona el préstamo puente?</p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
              <ArrowDown className="h-3 w-3 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Tú prestas</p>
              <p className="text-xs text-muted-foreground">Aportas capital al proyecto</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
              <RefreshCw className="h-3 w-3 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Ronda de inversión</p>
              <p className="text-xs text-muted-foreground">Se busca liquidez para pagar anticipadamente</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-3 w-3 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Liquidación</p>
              <p className="text-xs text-muted-foreground">Anticipada si hay inversión, o en {LOAN_CONFIG.termMonths} meses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <motion.div
        key={amount}
        initial={{ opacity: 0.8, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-5 rounded-xl bg-secondary/5 border border-secondary/20 space-y-3"
      >
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Monto que prestas</span>
          <span className="font-semibold text-foreground">{formatAmount(amount)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Tasa anual</span>
          <span className="font-medium">{LOAN_CONFIG.annualRate}%</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Plazo máximo</span>
          <span className="font-medium">{LOAN_CONFIG.termMonths} meses</span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Pago mensual promedio</span>
          <span className="font-semibold">{formatAmount(result.averagePayment)}</span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex justify-between items-center">
          <span className="font-medium">Total que recibes</span>
          <span className="text-xl font-display font-bold text-secondary">
            {formatAmount(result.totalPayment)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
          Intereses totales: {formatAmount(result.totalInterest)} • Capital fijo + intereses decrecientes
        </p>
      </motion.div>

      {/* CTA */}
      <Button 
        variant="secondary" 
        size="lg" 
        className="w-full group"
        onClick={handleDeclareIntent}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registrando...
          </>
        ) : (
          <>
            {user ? 'Declarar intención' : 'Regístrate para participar'}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </div>
  );
}
