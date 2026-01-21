import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="py-12 bg-foreground text-primary-foreground">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-xl font-display font-bold text-primary-foreground">U</span>
              </div>
              <span className="text-xl font-display font-semibold">Urbánika</span>
            </Link>
            <p className="text-primary-foreground/70 max-w-md">
              Proyecto inmobiliario regenerativo diseñado para crear comunidad, 
              generar valor y regenerar el ecosistema.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Proyecto</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#acerca" className="hover:text-primary-foreground transition-colors">Acerca</a></li>
              <li><a href="#terreno" className="hover:text-primary-foreground transition-colors">Terreno</a></li>
              <li><a href="#proyecto" className="hover:text-primary-foreground transition-colors">Arquitectura</a></li>
              <li><a href="#documentos" className="hover:text-primary-foreground transition-colors">Documentos</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <a href="mailto:info@urbanika.mx" className="hover:text-primary-foreground transition-colors">
                  info@urbanika.mx
                </a>
              </li>
              <li>Valle de Bravo, México</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} Urbánika. Todos los derechos reservados.
          </p>
          <p className="text-xs text-primary-foreground/40">
            Los rendimientos mostrados son estimados y no constituyen una promesa de retorno.
          </p>
        </div>
      </div>
    </footer>
  );
}
