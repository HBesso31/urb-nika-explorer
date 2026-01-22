import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Wallet, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePrivyAuth } from '@/hooks/usePrivyAuth';

const AuthPrivy = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login, appUser } = usePrivyAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && appUser && !isLoading) {
      navigate('/portal');
    }
  }, [isAuthenticated, appUser, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <Card className="shadow-strong border-border/50">
          <CardHeader className="text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center mb-4">
              <span className="text-2xl font-display font-bold text-primary-foreground">U</span>
            </div>
            
            <CardTitle className="text-2xl font-display">
              Bienvenido a Urbánika
            </CardTitle>
            <CardDescription>
              Inicia sesión con tu wallet o correo electrónico
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button 
              onClick={login}
              className="w-full" 
              size="lg"
            >
              <Wallet className="mr-2 h-5 w-5" />
              Conectar Wallet
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  o
                </span>
              </div>
            </div>

            <Button 
              onClick={login}
              variant="outline"
              className="w-full" 
              size="lg"
            >
              <Mail className="mr-2 h-5 w-5" />
              Continuar con Email
            </Button>

            <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/20 text-sm text-muted-foreground">
              <strong className="text-foreground">Importante:</strong> Este registro 
              es una declaración de intención, no un compromiso de pago. Los montos se 
              formalizarán cuando la infraestructura blockchain esté lista.
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthPrivy;
