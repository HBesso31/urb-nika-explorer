import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LogOut, 
  Loader2,
  TrendingUp,
  Wallet,
  Gift,
  Lock,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';
import { useContributions } from '@/hooks/useContributions';
import { usePayouts } from '@/hooks/usePayouts';
import { useUserBenefits } from '@/hooks/useUserBenefits';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { formatMXN, formatUSD } from '@/lib/simulatorConfig';

// Portal-specific components
import { ContributionSummary, ContributionValues } from '@/components/portal/ContributionSummary';
import { ContributionWizard } from '@/components/portal/ContributionWizard';
import { UserTransactions } from '@/components/portal/UserTransactions';

const Portal = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, appUser, logout, email, walletAddress } = usePrivyAuth();
  
  // Use app_user_id for data fetching
  const appUserId = appUser?.id;
  
  const { contributions, isLoading: contributionsLoading, totalContributedMXN, totalContributedUSD, refresh: refreshContributions } = useContributions(appUserId);
  const { payouts, isLoading: payoutsLoading, totalReceivedMXN, totalReceivedUSD } = usePayouts(appUserId);
  const { userBenefits, unlockedBenefits, lockedBenefits, isLoading: benefitsLoading } = useUserBenefits(appUserId);
  const { settings, isLoading: settingsLoading } = useSiteSettings();

  // Wizard state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardValues, setWizardValues] = useState<ContributionValues>({
    vehicle: 'investment',
    amountMXN: 50000,
    amountUSD: 0,
    currency: 'MXN',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  const handleAportar = useCallback((values: ContributionValues) => {
    setWizardValues(values);
    setWizardOpen(true);
  }, []);

  const handleWizardSuccess = useCallback(() => {
    refreshContributions();
  }, [refreshContributions]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !appUser) return null;

  const isLoading = contributionsLoading || payoutsLoading || benefitsLoading || settingsLoading;

  // Display identifier: wallet if available, otherwise email
  const displayIdentifier = walletAddress 
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : email || 'Usuario';

  // Format unlock date
  const formatUnlockDate = (date: string | null) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  };

  // Deposit address with fallback
  const depositAddress = settings?.deposit_address || 'urbanika.eth';

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
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {walletAddress ? (
                <Wallet className="h-4 w-4" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">{displayIdentifier}</span>
            </div>
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
            Gestiona tu participación y beneficios en Urbánika
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contribution Summary (replaces simulator) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <ContributionSummary onAportar={handleAportar} />
            </motion.div>

            {/* User Transactions List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <UserTransactions 
                contributions={contributions} 
                isLoading={contributionsLoading} 
              />
            </motion.div>

            {/* Summary Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Resumen de Participación
                  </CardTitle>
                  <CardDescription>
                    Tu aporte total y lo que has recibido
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-24 w-full" />
                  ) : (
                    <div className="space-y-4">
                      {/* Totals summary */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                          <p className="text-sm text-muted-foreground mb-1">Total Aportado</p>
                          <p className="text-2xl font-bold text-primary">{formatMXN(totalContributedMXN)}</p>
                          <p className="text-sm text-muted-foreground">{formatUSD(totalContributedUSD)}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                          <p className="text-sm text-muted-foreground mb-1">Total Recibido</p>
                          <p className="text-2xl font-bold text-secondary">{formatMXN(totalReceivedMXN)}</p>
                          <p className="text-sm text-muted-foreground">{formatUSD(totalReceivedUSD)}</p>
                        </div>
                      </div>

                      {/* Payouts history */}
                      {payouts.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <p className="text-sm font-medium mb-3">Historial de pagos recibidos</p>
                            <div className="space-y-2">
                              {payouts.map((payout) => (
                                <div 
                                  key={payout.id}
                                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                                >
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                      {new Date(payout.paid_at).toLocaleDateString('es-MX', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                      })}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">{formatMXN(Number(payout.amount_mxn))}</p>
                                    <p className="text-xs text-muted-foreground">{formatUSD(Number(payout.amount_usd))}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Benefits Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-accent" />
                    Tus Beneficios
                  </CardTitle>
                  <CardDescription>
                    Beneficios asignados a tu participación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {benefitsLoading ? (
                    <Skeleton className="h-32 w-full" />
                  ) : userBenefits.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">Aún no tienes beneficios asignados</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Unlocked benefits */}
                      {unlockedBenefits.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-secondary flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Desbloqueados
                          </p>
                          {unlockedBenefits.map((benefit) => (
                            <div 
                              key={benefit.id} 
                              className="p-4 rounded-lg bg-secondary/5 border border-secondary/20"
                            >
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-foreground">{benefit.benefit_name}</p>
                                {benefit.unlocked_at && (
                                  <span className="text-xs text-muted-foreground">
                                    Desbloqueado el {formatUnlockDate(benefit.unlocked_at)}
                                  </span>
                                )}
                              </div>
                              {benefit.notes && (
                                <p className="text-sm text-muted-foreground mt-1">{benefit.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Locked benefits */}
                      {lockedBenefits.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Por desbloquear
                          </p>
                          {lockedBenefits.map((benefit) => (
                            <div 
                              key={benefit.id} 
                              className="p-4 rounded-lg bg-muted/50 border border-border opacity-60"
                            >
                              <p className="font-medium text-foreground">{benefit.benefit_name}</p>
                              {benefit.notes && (
                                <p className="text-sm text-muted-foreground mt-1">{benefit.notes}</p>
                              )}
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
            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="shadow-soft">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {settingsLoading ? (
                    <Skeleton className="h-24 w-full" />
                  ) : (
                    <>
                      {/* Contacto Urbánika */}
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm font-medium mb-2">Contacto Urbánika</p>
                        <div className="space-y-2">
                          <a 
                            href={`mailto:${settings.urbanika_contact_email}`}
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <Mail className="h-4 w-4" />
                            {settings.urbanika_contact_email}
                          </a>
                          <a 
                            href={`https://wa.me/${settings.urbanika_contact_whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <Phone className="h-4 w-4" />
                            {settings.urbanika_contact_whatsapp}
                          </a>
                        </div>
                      </div>

                      {/* Contacto Humberto */}
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm font-medium mb-2">Contacto Humberto</p>
                        <div className="space-y-2">
                          <a 
                            href={`mailto:${settings.humberto_contact_email}`}
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <Mail className="h-4 w-4" />
                            {settings.humberto_contact_email}
                          </a>
                          <a 
                            href={`https://wa.me/${settings.humberto_contact_whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <Phone className="h-4 w-4" />
                            {settings.humberto_contact_whatsapp}
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Contribution Wizard Modal */}
      <ContributionWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        depositAddress={depositAddress}
        values={wizardValues}
        appUserId={appUserId}
        onSuccess={handleWizardSuccess}
      />
    </div>
  );
};

export default Portal;
