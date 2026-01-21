import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// TODO: Replace with actual authentication provider
// Options: Supabase Auth, Firebase Auth, Auth0, Clerk, etc.

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>(
    searchParams.get('mode') === 'register' ? 'register' : 'login'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMode(searchParams.get('mode') === 'register' ? 'register' : 'login');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // TODO: Implement actual authentication
    // This is a scaffold - replace with real auth logic
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo: just redirect to portal
      // In production, this would validate credentials
      navigate('/portal');
    } catch (err) {
      setError('Error de autenticación. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <Card className="shadow-strong border-border/50">
          <CardHeader className="text-center">
            {/* Logo */}
            <div className="mx-auto w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center mb-4">
              <span className="text-2xl font-display font-bold text-primary-foreground">U</span>
            </div>
            
            <CardTitle className="text-2xl font-display">
              {mode === 'login' ? 'Bienvenido de vuelta' : 'Crear cuenta'}
            </CardTitle>
            <CardDescription>
              {mode === 'login' 
                ? 'Ingresa tus credenciales para acceder a tu portal'
                : 'Únete a la comunidad de inversionistas de Urbánika'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'login' ? 'Ingresando...' : 'Creando cuenta...'}
                  </>
                ) : (
                  mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {mode === 'login' ? (
                  <>
                    ¿No tienes cuenta?{' '}
                    <Link 
                      to="/auth?mode=register" 
                      className="text-primary hover:underline font-medium"
                    >
                      Regístrate
                    </Link>
                  </>
                ) : (
                  <>
                    ¿Ya tienes cuenta?{' '}
                    <Link 
                      to="/auth" 
                      className="text-primary hover:underline font-medium"
                    >
                      Inicia sesión
                    </Link>
                  </>
                )}
              </p>
            </div>

            {/* TODO Notice */}
            <div className="mt-6 p-3 rounded-lg bg-muted text-xs text-muted-foreground">
              <strong>Nota para desarrolladores:</strong> Esta es una implementación 
              de scaffold. Integrar con proveedor de autenticación real (Supabase Auth, 
              Firebase, etc.) antes de producción.
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
