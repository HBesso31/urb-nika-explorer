import { motion } from 'framer-motion';
import { MapPin, Ruler, Home, TreePine, Sun, Droplets, Trash2, ThermometerSun, Sprout, Activity, Shield, Cpu, Lock, Gauge } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const projectFeatures = [
  {
    icon: MapPin,
    label: 'Ubicación',
    value: 'Querétaro',
    subvalue: 'México',
  },
  {
    icon: Ruler,
    label: 'Superficie',
    value: '2,500 m²',
    subvalue: 'Terreno total',
  },
  {
    icon: Home,
    label: 'Proyecto',
    value: 'Casa Acocui',
    subvalue: 'Vivienda off-grid',
  },
  {
    icon: TreePine,
    label: 'Ecosistema',
    value: 'Zona semiárida',
    subvalue: 'Regeneración activa',
  },
];

const ecotecnias = [
  {
    icon: Sun,
    title: 'Energía solar',
    description: 'Sistema fotovoltaico con respaldo de baterías para autonomía total.',
  },
  {
    icon: Droplets,
    title: 'Captación de agua',
    description: 'Cosecha pluvial y tratamiento de aguas grises para reutilización.',
  },
  {
    icon: Trash2,
    title: 'Gestión de residuos',
    description: 'Biodigestor y compostaje para cero residuos orgánicos.',
  },
  {
    icon: ThermometerSun,
    title: 'Diseño bioclimático',
    description: 'Orientación y materiales optimizados para confort térmico natural.',
  },
  {
    icon: Sprout,
    title: 'Huerto regenerativo',
    description: 'Producción de alimentos con principios de permacultura.',
  },
];

const familyCareSystems = [
  {
    icon: Activity,
    title: 'Monitoreo de salud',
    description: 'Seguimiento del bienestar de habitantes en tiempo real.',
  },
  {
    icon: Shield,
    title: 'Privacidad absoluta',
    description: 'Datos protegidos que nunca salen del hogar.',
  },
  {
    icon: Cpu,
    title: 'IA local',
    description: 'Inteligencia artificial que corre en dispositivos locales, sin nube.',
  },
  {
    icon: Lock,
    title: 'Seguridad criptográfica',
    description: 'Protección de datos con estándares de cifrado avanzados.',
  },
  {
    icon: Gauge,
    title: 'Sensores de mantenimiento',
    description: 'Monitoreo preventivo de cada ecotecnia para óptimo funcionamiento.',
  },
];

export function ProjectSection() {
  return (
    <section id="proyecto" className="py-16 lg:py-24 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-display text-foreground mb-4">
            Casa Acocui
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Nuestra primera vivienda off-grid: un espacio donde la tecnología regenerativa 
            se integra con arquitectura bioclimática y sistemas de cuidado familiar inteligente.
          </p>
        </motion.div>

        {/* Project stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {projectFeatures.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full gradient-card border-border/50 hover-lift">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {feature.label}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {feature.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {feature.subvalue}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Ecotecnias block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-6 lg:p-8 rounded-xl bg-card border border-border/50 shadow-soft mb-6"
        >
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Ecotecnias
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Sistemas regenerativos que permiten vivir de manera autosuficiente y en armonía con el entorno.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {ecotecnias.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="p-2 rounded-lg bg-secondary/10 shrink-0">
                  <item.icon className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground block">{item.title}</span>
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Family care systems block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-6 lg:p-8 rounded-xl bg-card border border-border/50 shadow-soft"
        >
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Sistemas de Cuidado Familiar
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Tecnología inteligente que cuida a tu familia con privacidad total y seguridad de nivel bancario.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {familyCareSystems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground block">{item.title}</span>
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
