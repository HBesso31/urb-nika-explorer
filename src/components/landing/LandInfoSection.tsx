import { motion } from 'framer-motion';
import { MapPin, Ruler, FileCheck, Building } from 'lucide-react';
import { landInfo } from '@/lib/projectAssets';
import { Card, CardContent } from '@/components/ui/card';

export function LandInfoSection() {
  const infoItems = [
    {
      icon: MapPin,
      label: 'Ubicación',
      value: landInfo.location,
      subvalue: landInfo.address,
    },
    {
      icon: Ruler,
      label: 'Superficie Total',
      value: landInfo.totalArea,
      subvalue: `Área útil: ${landInfo.usableArea}`,
    },
    {
      icon: Building,
      label: 'Zonificación',
      value: landInfo.zoning,
      subvalue: 'Densidad media residencial',
    },
    {
      icon: FileCheck,
      label: 'Estatus Legal',
      value: 'Regularizado',
      subvalue: landInfo.status,
    },
  ];

  return (
    <section id="terreno" className="py-16 lg:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-display text-foreground mb-4">
            El Terreno
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Un espacio privilegiado en una de las zonas más codiciadas del Estado de México, 
            con todos los permisos y documentación en regla.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {infoItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full gradient-card border-border/50 hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-lg bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      {item.label}
                    </span>
                  </div>
                  <p className="text-xl font-semibold text-foreground mb-1">
                    {item.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.subvalue}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
