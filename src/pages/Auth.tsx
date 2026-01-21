import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, signIn, signUp, isLoading: authLoading } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'register'>(
    searchParams.get('mode') === 'register' ? 'register' : 'login'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/portal');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    setMode(searchParams.get('mode') === 'register' ? 'register' : 'login');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (mode === 'register') {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setError(translateError(error));
        setIsLoading(false);
        return;
      }
      toast.success('¡Cuenta creada!', { 
        description: 'Bienvenido a Urbánika. Ya puedes acceder a tu portal.' 
      });
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(translateError(error));
        setIsLoading(false);
        return;
      }
      toast.success('¡Bienvenido de vuelta!');
    }

    setIsLoading(false);
    navigate('/portal');
  };

  const translateError = (error: string): string => {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Credenciales incorrectas',
      'User already registered': 'Este correo ya está registrado',
      'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
    };
    return errorMap[error] || error;
  };

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
              {mode === 'login' ? 'Bienvenido de vuelta' : 'Únete a Urbánika'}
            </CardTitle>
            <CardDescription>
              {mode === 'login' 
                ? 'Ingresa tus credenciales para acceder a tu portal'
                : 'Registro de intención — no implica compromiso financiero'
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nombre completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Tu nombre"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

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
                    minLength={6}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {mode === 'login' ? 'Ingresando...' : 'Creando cuenta...'}
                  </span>
                ) : (
                  mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {mode === 'login' ? (
                  <span>
                    ¿No tienes cuenta?{' '}
                    <Link 
                      to="/auth?mode=register" 
                      className="text-primary hover:underline font-medium"
                    >
                      Regístrate
                    </Link>
                  </span>
                ) : (
                  <span>
                    ¿Ya tienes cuenta?{' '}
                    <Link 
                      to="/auth" 
                      className="text-primary hover:underline font-medium"
                    >
                      Inicia sesión
                    </Link>
                  </span>
                )}
              </p>
            </div>

            {mode === 'register' && (
              <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/20 text-sm text-muted-foreground">
                <strong className="text-foreground">Importante:</strong> Este registro 
                es una declaración de intención, no un compromiso de pago. Los montos se 
                formalizarán cuando la infraestructura blockchain esté lista.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
