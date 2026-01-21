import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  TrendingUp, 
  LogOut, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Calendar,
  DollarSign,
  Clock,
  Gift,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/hooks/useWallet';
import { useAuth } from '@/hooks/useAuth';
import { useParticipations } from '@/hooks/useParticipations';
import { useBenefits } from '@/hooks/useBenefits';
import { formatCurrency, getScenarioLabel } from '@/lib/simulatorV2';
import { Skeleton } from '@/components/ui/skeleton';

const Portal = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, signOut } = useAuth();
  const { state, formattedAddress, connect, disconnect, isConnected, isConnecting, error: walletError } = useWallet();
  const { participations, isLoading: participationsLoading, totalInvested } = useParticipations();
  const { benefits, getUnlockedBenefits, getLockedBenefits, isLoading: benefitsLoading } = useBenefits();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const unlockedBenefits = getUnlockedBenefits(totalInvested);
  const lockedBenefits = getLockedBenefits(totalInvested);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <span className="text-lg font-display font-bold text-primary-foreground">U</span>
            </div>
            <span className="font-display font-semibold">Urbánika</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user.email}
            </span>
            <Button variant="ghost" size="sm" className="gap-2" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl lg:text-4xl font-display font-semibold mb-2">
            Tu Portal
          </h1>
          <p className="text-muted-foreground mb-8">
            Gestiona tus participaciones y beneficios en Urbánika
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Participations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Mis Participaciones
                  </CardTitle>
                  <CardDescription>
                    Intenciones declaradas de inversión y préstamo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {participationsLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ) : participations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm mb-4">Aún no has declarado ninguna intención</p>
                      <Link to="/">
                        <Button variant="outline" size="sm" className="gap-2">
                          Explorar simulador
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {participations.map((p) => (
                        <ParticipationCard key={p.id} participation={p} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-accent" />
                    Beneficios
                  </CardTitle>
                  <CardDescription>
                    Beneficios desbloqueados según tu nivel de participación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {benefitsLoading ? (
                    <Skeleton className="h-32 w-full" />
                  ) : (
                    <div className="space-y-4">
                      {unlockedBenefits.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-secondary flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Desbloqueados
                          </p>
                          {unlockedBenefits.map((b) => (
                            <div 
                              key={b.id} 
                              className="p-4 rounded-lg bg-secondary/5 border border-secondary/20"
                            >
                              <p className="font-medium text-foreground">{b.title}</p>
                              <p className="text-sm text-muted-foreground">{b.description}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {lockedBenefits.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Por desbloquear
                          </p>
                          {lockedBenefits.map((b) => (
                            <div 
                              key={b.id} 
                              className="p-4 rounded-lg bg-muted/50 border border-border opacity-60"
                            >
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-foreground">{b.title}</p>
                                <Badge variant="outline">
                                  {formatCurrency(Number(b.min_investment))}+
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{b.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="gradient-card shadow-soft">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-2">Total declarado</p>
                  <p className="text-3xl font-display font-bold text-primary">
                    {formatCurrency(totalInvested)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    en {participations.length} participación(es)
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Wallet Connection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card className="border-2 border-primary/20 shadow-soft">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wallet className="h-5 w-5 text-primary" />
                    Conectar Wallet
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Próximamente: vincula tu billetera para transacciones en criptodólares
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    {state === 'idle' && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-3 h-3 rounded-full bg-muted-foreground/50" />
                        <span className="text-sm">No conectado</span>
                      </div>
                    )}
                    {state === 'connecting' && (
                      <div className="flex items-center gap-3 text-primary">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Conectando...</span>
                      </div>
                    )}
                    {state === 'connected' && (
                      <div className="flex items-center gap-3 text-secondary">
                        <CheckCircle className="h-4 w-4" />
                        <div>
                          <span className="text-sm font-medium">Conectado</span>
                          <p className="text-xs text-muted-foreground font-mono">
                            {formattedAddress}
                          </p>
                        </div>
                      </div>
                    )}
                    {state === 'error' && (
                      <div className="flex items-center gap-3 text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{walletError || 'Error'}</span>
                      </div>
                    )}
                  </div>

                  {isConnected ? (
                    <Button variant="outline" onClick={disconnect} className="w-full" size="sm">
                      Desconectar
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={connect} 
                      className="w-full"
                      size="sm"
                      disabled
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Próximamente
                    </Button>
                  )}

                  <p className="text-xs text-muted-foreground">
                    La conexión de wallet estará disponible cuando la infraestructura 
                    blockchain esté lista.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

function ParticipationCard({ participation }: { participation: any }) {
  const statusColors: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    active: 'bg-secondary/10 text-secondary border-secondary/20',
    closed: 'bg-muted text-muted-foreground border-border',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    active: 'Activo',
    closed: 'Cerrado',
  };

  const typeLabels: Record<string, string> = {
    investment: 'Inversión',
    loan: 'Préstamo',
  };

  return (
    <div className="p-4 rounded-xl bg-card border border-border/50 shadow-soft">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {participation.type === 'investment' ? (
            <TrendingUp className="h-5 w-5 text-primary" />
          ) : (
            <Wallet className="h-5 w-5 text-secondary" />
          )}
          <span className="font-semibold">{typeLabels[participation.type]}</span>
        </div>
        <Badge className={statusColors[participation.status]}>
          {statusLabels[participation.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-muted-foreground text-xs">Monto</p>
            <p className="font-medium">{formatCurrency(Number(participation.amount))}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-muted-foreground text-xs">Plazo</p>
            <p className="font-medium">{participation.term_months} meses</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-muted-foreground text-xs">Escenario</p>
            <p className="font-medium">{getScenarioLabel(participation.scenario)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-muted-foreground text-xs">Registrado</p>
            <p className="font-medium">
              {new Date(participation.created_at).toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {participation.estimated_return && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {participation.type === 'investment' ? 'Rendimiento estimado' : 'Interés estimado'}
            </span>
            <span className={`font-semibold ${
              participation.type === 'investment' ? 'text-secondary' : 'text-muted-foreground'
            }`}>
              {participation.type === 'investment' ? '+' : ''}{formatCurrency(Number(participation.estimated_return))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Portal;
