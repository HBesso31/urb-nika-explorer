import { motion } from 'framer-motion';
import { Vote, Home, Users, Leaf } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const benefits = [
  {
    icon: Vote,
    title: 'Voz y Voto',
    description: 'Opina y vota en decisiones clave del proyecto.',
    highlight: 'Desde $5,000 USD',
  },
  {
    icon: Home,
    title: 'Acceso a la Casa',
    description: 'Noches de estancia en Casa Acocui según tu nivel de participación. Vive la experiencia Urbánika.',
    highlight: 'Desde $10,000 USD',
  },
  {
    icon: Users,
    title: 'Comunidad Exclusiva',
    description: 'Acceso a la red de inversionistas, eventos privados y oportunidades de networking regenerativo.',
    highlight: 'Desde $1,000 USD',
  },
  {
    icon: Leaf,
    title: 'Impacto Regenerativo',
    description: 'Contribuyes directamente a un modelo de desarrollo que regenera el ecosistema local.',
    highlight: 'Cualquier monto',
  },
];

export function NonFinancialBenefitsSection() {
  return (
    <section id="beneficios-no-financieros" className="py-16 lg:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-display text-foreground mb-4">
            Más que retorno financiero
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Participar en Urbánika es mucho más que una inversión. 
            Es formar parte de un proyecto de vida.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-0 shadow-soft bg-card hover-lift overflow-hidden">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                    <div className="shrink-0">
                      <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center shadow-glow">
                        <benefit.icon className="h-7 w-7 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <h3 className="text-xl font-semibold text-foreground">
                          {benefit.title}
                        </h3>
                        <Badge 
                          variant="secondary" 
                          className="w-fit shrink-0 whitespace-nowrap bg-accent/20 text-accent border-0 px-3 py-1"
                        >
                          {benefit.highlight}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
