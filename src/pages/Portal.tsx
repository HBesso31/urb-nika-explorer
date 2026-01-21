import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, FileText, ArrowRight, LogOut, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWallet } from '@/hooks/useWallet';

// TODO: Replace mock data with actual user data from authentication
const mockUser = {
  name: 'Inversionista',
  email: 'usuario@ejemplo.com',
};

const Portal = () => {
  const { state, formattedAddress, connect, disconnect, isConnected, isConnecting, error } = useWallet();

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
              Hola, {mockUser.name}
            </span>
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl lg:text-4xl font-display font-semibold mb-2">
            Tu Portal de Inversión
          </h1>
          <p className="text-muted-foreground mb-8">
            Bienvenido a tu espacio personal en Urbánika
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Wallet Connection Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 lg:col-span-1"
          >
            <Card className="h-full border-2 border-primary/20 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Conectar Wallet
                </CardTitle>
                <CardDescription>
                  Vincula tu billetera digital para habilitar transacciones en criptodólares
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Wallet Status */}
                <div className="p-4 rounded-lg bg-muted/50">
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
                      <span className="text-sm">{error || 'Error de conexión'}</span>
                    </div>
                  )}
                </div>

                {isConnected ? (
                  <Button variant="outline" onClick={disconnect} className="w-full">
                    Desconectar Wallet
                  </Button>
                ) : (
                  <Button 
                    variant="hero" 
                    onClick={connect} 
                    className="w-full"
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-4 w-4" />
                        Conectar Wallet
                      </>
                    )}
                  </Button>
                )}

                <p className="text-xs text-muted-foreground">
                  Tu wallet te permitirá realizar inversiones y préstamos de forma 
                  segura utilizando criptodólares (USDC/USDT).
                </p>

                {/* TODO Notice */}
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-xs">
                  <strong className="text-accent-foreground">Demo Mode:</strong>{' '}
                  <span className="text-muted-foreground">
                    Esta es una simulación. La integración real con Privy/Web3 está pendiente.
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Investment Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                  Mis Inversiones
                </CardTitle>
                <CardDescription>
                  Resumen de tu participación en el proyecto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Aún no tienes inversiones activas</p>
                  <Link to="/" className="text-primary text-sm hover:underline mt-2 inline-flex items-center gap-1">
                    Explorar oportunidades <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Mis Documentos
                </CardTitle>
                <CardDescription>
                  Contratos y comprobantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Sin documentos por ahora</p>
                  <p className="text-xs mt-2">
                    Los documentos aparecerán aquí después de tu primera inversión
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Developer Notes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-xl bg-muted border border-border"
        >
          <h3 className="font-semibold text-foreground mb-3">
            📋 Notas para el desarrollador
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong>Auth:</strong> Reemplazar scaffold con proveedor real (Supabase/Firebase)</li>
            <li>• <strong>Wallet:</strong> Integrar Privy o RainbowKit para conexión Web3</li>
            <li>• <strong>Data:</strong> Conectar a base de datos para historial de simulaciones</li>
            <li>• <strong>Smart Contracts:</strong> Implementar contratos para inversiones/préstamos</li>
          </ul>
        </motion.div>
      </main>
    </div>
  );
};

export default Portal;
