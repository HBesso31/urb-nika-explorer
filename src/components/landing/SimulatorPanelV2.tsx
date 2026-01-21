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
  formatCurrency, 
} from '@/lib/simulatorV2';
import { useAuth } from '@/hooks/useAuth';
import { useParticipations, CreateParticipationInput } from '@/hooks/useParticipations';
import { toast } from 'sonner';

interface SimulatorPanelV2Props {
  activeTab?: 'investment' | 'loan';
  onTabChange?: (tab: 'investment' | 'loan') => void;
}

type Currency = 'MXN' | 'USD';

// Exchange rate (approximate)
const USD_TO_MXN = 17.5;

// Currency context to share between components
const CurrencyContext = createContext<{
  currency: Currency;
  formatAmount: (amount: number) => string;
}>({
  currency: 'MXN',
  formatAmount: (amount) => formatCurrency(amount),
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

const INVESTMENT_LIMITS = { min: 1000, max: 100000, default: 10000 };
const LOAN_LIMITS = { min: 5000, max: 500000, default: 50000 };

// Loan round goal configuration
const LOAN_ROUND_GOAL = 500000;
const LOAN_ROUND_CURRENT = 175000; // This would come from DB in production

// Fixed loan configuration (single scenario)
const LOAN_ANNUAL_RATE = 8; // 8% annual
const LOAN_TERM_MONTHS = 48; // Fixed 48 months

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

  const formatAmount = (amount: number) => {
    if (currency === 'USD') {
      const usdAmount = amount / USD_TO_MXN;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(usdAmount);
    }
    return formatCurrency(amount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, formatAmount }}>
      <Card className="sticky top-8 shadow-strong border-border/50 overflow-hidden">
        <div className="absolute inset-0 gradient-card" />
        <div className="relative z-10">
          <CardHeader className="pb-4">
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
                <InvestmentSimulatorV2 />
              </TabsContent>

              <TabsContent value="loan">
                <LoanSimulatorV2 />
              </TabsContent>
            </Tabs>

            <div className="mt-6 p-3 rounded-lg bg-muted/50 border border-border/50">
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
  
  const [amount, setAmount] = useState(INVESTMENT_LIMITS.default);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate estimated ranges (conservative to optimistic)
  const results = useMemo(() => {
    const monthlyRentMin = amount * 0.004; // ~4.8% annual (conservative)
    const monthlyRentMax = amount * 0.008; // ~9.6% annual (optimistic)
    
    const longTermGainMin = amount * 0.3; // 30% appreciation (conservative, 5+ years)
    const longTermGainMax = amount * 0.8; // 80% appreciation (optimistic, 5+ years)
    
    return {
      monthlyRentMin,
      monthlyRentMax,
      longTermGainMin,
      longTermGainMax,
    };
  }, [amount]);

  // Determine non-financial benefits based on amount
  const benefits = useMemo(() => {
    const list = [];
    if (amount >= 1000) list.push({ icon: Users, text: 'Comunidad exclusiva' });
    if (amount >= 5000) list.push({ icon: Vote, text: 'Voz y voto en decisiones' });
    if (amount >= 10000) list.push({ icon: Home, text: 'Acceso a la casa' });
    return list;
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
      termMonths: 60, // Default long-term
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
      {/* Amount */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label>Monto a invertir</Label>
          <span className="text-lg font-semibold text-primary">
            {formatAmount(amount)}
          </span>
        </div>
        <Slider
          min={INVESTMENT_LIMITS.min}
          max={INVESTMENT_LIMITS.max}
          step={1000}
          value={[amount]}
          onValueChange={([v]) => setAmount(v)}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatAmount(INVESTMENT_LIMITS.min)}</span>
          <span>{formatAmount(INVESTMENT_LIMITS.max)}</span>
        </div>
      </div>

      {/* Results as ranges */}
      <motion.div
        key={amount}
        initial={{ opacity: 0.8, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-5 rounded-xl bg-primary/5 border border-primary/20 space-y-4"
      >
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Renta mensual estimada</p>
            <p className="text-lg font-semibold text-foreground">
              {formatAmount(results.monthlyRentMin)} – {formatAmount(results.monthlyRentMax)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Ganancia potencial a largo plazo</p>
            <p className="text-lg font-semibold text-secondary">
              +{formatAmount(results.longTermGainMin)} – +{formatAmount(results.longTermGainMax)}
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground border-t border-border/50 pt-3">
          La decisión de venta se toma colectivamente. No hay fecha fija de salida.
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
  
  const [amount, setAmount] = useState(LOAN_LIMITS.default);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate real amortization
  const result = useMemo(() => {
    const monthlyRate = LOAN_ANNUAL_RATE / 100 / 12;
    const n = LOAN_TERM_MONTHS;
    
    // Monthly payment formula (PMT)
    const monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    const totalReceived = monthlyPayment * n;
    const totalInterest = totalReceived - amount;
    
    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalReceived: Math.round(totalReceived * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
    };
  }, [amount]);

  // Calculate progress toward loan round goal
  const progressPercent = Math.min((LOAN_ROUND_CURRENT / LOAN_ROUND_GOAL) * 100, 100);
  const userContributionPercent = ((amount / LOAN_ROUND_GOAL) * 100).toFixed(1);

  const handleDeclareIntent = async () => {
    if (!user) {
      navigate('/auth?mode=register&intent=loan');
      return;
    }

    setIsSubmitting(true);
    const input: CreateParticipationInput = {
      type: 'loan',
      amount,
      termMonths: LOAN_TERM_MONTHS,
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
            {formatAmount(LOAN_ROUND_CURRENT)} / {formatAmount(LOAN_ROUND_GOAL)}
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
          min={LOAN_LIMITS.min}
          max={LOAN_LIMITS.max}
          step={5000}
          value={[amount]}
          onValueChange={([v]) => setAmount(v)}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatAmount(LOAN_LIMITS.min)}</span>
          <span>{formatAmount(LOAN_LIMITS.max)}</span>
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
              <p className="text-xs text-muted-foreground">Anticipada si hay inversión, o en 48 meses</p>
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
          <span className="font-medium">{formatAmount(amount)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Tasa anual</span>
          <span className="font-medium">{LOAN_ANNUAL_RATE}%</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Plazo máximo</span>
          <span className="font-medium">{LOAN_TERM_MONTHS} meses</span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Pago mensual estimado</span>
          <span className="font-semibold">{formatAmount(result.monthlyPayment)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Total estimado que recibes</span>
          <span className="text-xl font-display font-bold text-secondary">
            {formatAmount(result.totalReceived)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
          Intereses totales: {formatAmount(result.totalInterest)} (amortización real, los intereses disminuyen con cada pago)
        </p>
      </motion.div>

      {/* User contribution message */}
      <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-center">
        <p className="text-sm text-foreground">
          ¡Tú aportarías el <span className="font-semibold text-accent">{userContributionPercent}%</span> del monto total!
        </p>
        <p className="text-xs text-muted-foreground mt-1">Gracias por hacerlo posible.</p>
      </div>

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
