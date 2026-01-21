import { motion } from 'framer-motion';
import { Sun, Droplets, Wifi, Shield, CheckCircle } from 'lucide-react';

const solutions = [
  {
    icon: Sun,
    title: 'Energía Solar Off-Grid',
    features: ['Paneles solares de alta eficiencia', 'Baterías de respaldo', 'Independencia total de CFE'],
  },
  {
    icon: Droplets,
    title: 'Captación de Agua',
    features: ['Sistema de captación pluvial', 'Tratamiento y purificación', 'Almacenamiento sustentable'],
  },
  {
    icon: Wifi,
    title: 'Conectividad Satelital',
    features: ['Internet de alta velocidad', 'Cobertura en cualquier ubicación', 'Trabajo remoto sin límites'],
  },
  {
    icon: Shield,
    title: 'Legalidad Total',
    features: ['Escrituras en orden', 'Uso de suelo aprobado', 'Permisos de construcción'],
  },
];

export function SolutionSection() {
  return (
    <section id="solucion" className="py-16 lg:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary mb-4">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">La Solución Urbánika</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-display text-foreground mb-4">
            Infraestructura regenerativa completa
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Resolvemos el problema de raíz: construimos la infraestructura que permite 
            vivir en armonía con la naturaleza, sin sacrificar comodidad ni conectividad.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-xl gradient-card border border-border/50 shadow-soft hover-lift"
            >
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <solution.icon className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {solution.title}
              </h3>
              <ul className="space-y-2">
                {solution.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
