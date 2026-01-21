import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function Header() {

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
              <span className="text-xl font-display font-bold text-primary-foreground">U</span>
            </div>
            <span className="text-xl font-display font-semibold text-foreground">Urbánika</span>
          </Link>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link to="/auth?mode=register">
              <Button variant="default">Registrarse</Button>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
