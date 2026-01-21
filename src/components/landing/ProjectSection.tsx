import { motion } from "framer-motion";
import { MapPin, Ruler, Home, TreePine } from "lucide-react";
import { landInfo } from "@/lib/projectAssets";
import { Card, CardContent } from "@/components/ui/card";

const projectFeatures = [
  {
    icon: MapPin,
    label: "Ubicación",
    value: "Valle de Bravo",
    subvalue: "Estado de México",
  },
  {
    icon: Ruler,
    label: "Superficie",
    value: "289.66 m²",
    subvalue: "144.83 m² construibles",
  },
  {
    icon: Home,
    label: "Proyecto",
    value: "Casa Acocui",
    subvalue: "Segunda casa modelo",
  },
];

const projectSystems = [
  "Sistema fotovoltaico de 5kW con respaldo de baterías",
  "Captación pluvial de 50,000 litros anuales",
  "Biodigestor y tratamiento de aguas grises",
  "Conectividad Starlink para internet de alta velocidad",
  "Construcción bioclimática con materiales locales",
  "Huerto regenerativo y áreas de permacultura",
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
          <h2 className="text-3xl lg:text-4xl font-display text-foreground mb-4">Casa Acocui</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Nuestra segunda casa modelo: un espacio donde la tecnología off-grid se integra con arquitectura
            bioclimática y diseño regenerativo.
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
                  <p className="text-lg font-semibold text-foreground">{feature.value}</p>
                  <p className="text-sm text-muted-foreground">{feature.subvalue}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Systems list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-6 lg:p-8 rounded-xl bg-card border border-border/50 shadow-soft"
        >
          <h3 className="text-xl font-semibold text-foreground mb-4">Sistemas integrados</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {projectSystems.map((system, index) => (
              <motion.div
                key={system}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div className="w-2 h-2 rounded-full bg-secondary shrink-0 mt-2" />
                <span className="text-sm text-muted-foreground">{system}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
