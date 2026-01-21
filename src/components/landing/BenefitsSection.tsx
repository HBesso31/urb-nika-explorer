import { motion } from 'framer-motion';
import { TrendingUp, Leaf, Eye, Users, LucideIcon } from 'lucide-react';
import { projectBenefits } from '@/lib/projectAssets';
import { Card, CardContent } from '@/components/ui/card';

const iconMap: Record<string, LucideIcon> = {
  'trending-up': TrendingUp,
  'leaf': Leaf,
  'eye': Eye,
  'users': Users,
};

export function BenefitsSection() {
  return (
    <section id="beneficios" className="py-16 lg:py-24 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-display text-foreground mb-4">
            ¿Por qué Urbánika?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un modelo de inversión diseñado para crear valor real, 
            con transparencia y propósito regenerativo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projectBenefits.map((benefit, index) => {
            const Icon = iconMap[benefit.icon] || TrendingUp;
            
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-soft bg-card hover-lift">
                  <CardContent className="p-8">
                    <div className="flex gap-6">
                      <div className="shrink-0">
                        <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center shadow-glow">
                          <Icon className="h-7 w-7 text-primary-foreground" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
