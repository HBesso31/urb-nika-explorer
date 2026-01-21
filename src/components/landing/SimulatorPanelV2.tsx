import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, Info, ArrowRight, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Scenario, 
  simulateInvestmentV2, 
  simulateLoanV2, 
  formatCurrency, 
  formatPercentage,
  getScenarioLabel,
  investmentRates,
  loanRates,
} from '@/lib/simulatorV2';
import { useAuth } from '@/hooks/useAuth';
import { useParticipations, CreateParticipationInput } from '@/hooks/useParticipations';
import { toast } from 'sonner';

interface SimulatorPanelV2Props {
  activeTab?: 'investment' | 'loan';
  onTabChange?: (tab: 'investment' | 'loan') => void;
}

const INVESTMENT_LIMITS = { min: 1000, max: 100000, default: 10000 };
const LOAN_LIMITS = { min: 5000, max: 500000, default: 50000 };
const TERM_OPTIONS = [12, 24, 36, 48, 60];

export function SimulatorPanelV2({ activeTab = 'investment', onTabChange }: SimulatorPanelV2Props) {
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
            Calcula tu retorno estimado y declara tu intención
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
  );
}

function InvestmentSimulatorV2() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createParticipation } = useParticipations();
  
  const [amount, setAmount] = useState(INVESTMENT_LIMITS.default);
  const [termMonths, setTermMonths] = useState(24);
  const [scenario, setScenario] = useState<Scenario>('base');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const result = simulateInvestmentV2({ amount, termMonths, scenario });

  const handleDeclareIntent = async () => {
    if (!user) {
      navigate('/auth?mode=register&intent=investment');
      return;
    }

    setIsSubmitting(true);
    const input: CreateParticipationInput = {
      type: 'investment',
      amount,
      termMonths,
      scenario,
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
            {formatCurrency(amount)}
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
          <span>{formatCurrency(INVESTMENT_LIMITS.min)}</span>
          <span>{formatCurrency(INVESTMENT_LIMITS.max)}</span>
        </div>
      </div>

      {/* Term */}
      <div className="space-y-3">
        <Label>Plazo</Label>
        <div className="flex gap-2 flex-wrap">
          {TERM_OPTIONS.map((term) => (
            <Button
              key={term}
              variant={termMonths === term ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTermMonths(term)}
              className="flex-1 min-w-[60px]"
            >
              {term}m
            </Button>
          ))}
        </div>
      </div>

      {/* Scenario */}
      <div className="space-y-3">
        <Label>Escenario</Label>
        <RadioGroup 
          value={scenario} 
          onValueChange={(v) => setScenario(v as Scenario)}
          className="grid grid-cols-3 gap-2"
        >
          {(['conservative', 'base', 'optimistic'] as Scenario[]).map((s) => (
            <div key={s} className="relative">
              <RadioGroupItem value={s} id={`inv-${s}`} className="peer sr-only" />
              <Label
                htmlFor={`inv-${s}`}
                className="flex flex-col items-center p-3 rounded-lg border-2 border-muted bg-card cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
              >
                <span className="text-sm font-medium">{getScenarioLabel(s)}</span>
                <span className="text-xs text-muted-foreground">
                  {formatPercentage(investmentRates[s])} anual
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Results */}
      <motion.div
        key={`${amount}-${termMonths}-${scenario}`}
        initial={{ opacity: 0.8, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-5 rounded-xl bg-primary/5 border border-primary/20 space-y-3"
      >
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Capital inicial</span>
          <span className="font-medium">{formatCurrency(result.initialAmount)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Ganancia estimada</span>
          <span className="font-medium text-secondary">+{formatCurrency(result.totalProfit)}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Rango: {formatCurrency(result.rangeMin)} – {formatCurrency(result.rangeMax)}
        </div>
        <div className="h-px bg-border" />
        <div className="flex justify-between items-center">
          <span className="font-medium">Total al vencimiento</span>
          <span className="text-2xl font-display font-bold text-primary">
            {formatCurrency(result.totalReturn)}
          </span>
        </div>
      </motion.div>

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
  
  const [amount, setAmount] = useState(LOAN_LIMITS.default);
  const [termMonths, setTermMonths] = useState(36);
  const [scenario, setScenario] = useState<Scenario>('base');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const result = simulateLoanV2({ amount, termMonths, scenario });

  const handleDeclareIntent = async () => {
    if (!user) {
      navigate('/auth?mode=register&intent=loan');
      return;
    }

    setIsSubmitting(true);
    const input: CreateParticipationInput = {
      type: 'loan',
      amount,
      termMonths,
      scenario,
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
          <Label>Monto del préstamo</Label>
          <span className="text-lg font-semibold text-primary">
            {formatCurrency(amount)}
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
          <span>{formatCurrency(LOAN_LIMITS.min)}</span>
          <span>{formatCurrency(LOAN_LIMITS.max)}</span>
        </div>
      </div>

      {/* Term */}
      <div className="space-y-3">
        <Label>Plazo</Label>
        <div className="flex gap-2 flex-wrap">
          {TERM_OPTIONS.map((term) => (
            <Button
              key={term}
              variant={termMonths === term ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTermMonths(term)}
              className="flex-1 min-w-[60px]"
            >
              {term}m
            </Button>
          ))}
        </div>
      </div>

      {/* Scenario */}
      <div className="space-y-3">
        <Label>Escenario</Label>
        <RadioGroup 
          value={scenario} 
          onValueChange={(v) => setScenario(v as Scenario)}
          className="grid grid-cols-3 gap-2"
        >
          {(['conservative', 'base', 'optimistic'] as Scenario[]).map((s) => (
            <div key={s} className="relative">
              <RadioGroupItem value={s} id={`loan-${s}`} className="peer sr-only" />
              <Label
                htmlFor={`loan-${s}`}
                className="flex flex-col items-center p-3 rounded-lg border-2 border-muted bg-card cursor-pointer transition-all peer-data-[state=checked]:border-secondary peer-data-[state=checked]:bg-secondary/5"
              >
                <span className="text-sm font-medium">{getScenarioLabel(s)}</span>
                <span className="text-xs text-muted-foreground">
                  {formatPercentage(loanRates[s])} anual
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Results */}
      <motion.div
        key={`${amount}-${termMonths}-${scenario}`}
        initial={{ opacity: 0.8, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-5 rounded-xl bg-secondary/5 border border-secondary/20 space-y-3"
      >
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Monto del préstamo</span>
          <span className="font-medium">{formatCurrency(result.loanAmount)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Intereses totales</span>
          <span className="font-medium">{formatCurrency(result.totalInterest)}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Pago mensual: {formatCurrency(result.rangeMin)} – {formatCurrency(result.rangeMax)}
        </div>
        <div className="h-px bg-border" />
        <div className="flex justify-between items-center">
          <span className="font-medium">Pago mensual</span>
          <span className="text-2xl font-display font-bold text-secondary">
            {formatCurrency(result.monthlyPayment)}
          </span>
        </div>
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
