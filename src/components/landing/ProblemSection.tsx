import { motion } from 'framer-motion';
import { AlertTriangle, Zap, Droplets, Wifi } from 'lucide-react';

const problems = [
  {
    icon: Zap,
    title: 'Sin conexión eléctrica',
    description: 'Las zonas rurales más atractivas carecen de infraestructura de CFE, bloqueando el desarrollo.',
  },
  {
    icon: Droplets,
    title: 'Sin agua potable',
    description: 'Terrenos increíbles que dependen de pipas o pozos irregulares, sin garantía de abasto.',
  },
  {
    icon: Wifi,
    title: 'Sin conectividad',
    description: 'Aislamiento digital que hace imposible trabajar remotamente o mantener comunicación.',
  },
];

export function ProblemSection() {
  return (
    <section id="problema" className="py-16 lg:py-24 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive mb-4">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">El Problema Real</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-display text-foreground mb-4">
            Los mejores terrenos están bloqueados
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontrar un terreno hermoso es fácil. Desarrollarlo sin acceso a servicios 
            básicos es lo que detiene a la mayoría.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-xl bg-card border border-border/50 shadow-soft"
            >
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                <problem.icon className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {problem.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
