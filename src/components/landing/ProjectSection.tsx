import { motion } from 'framer-motion';
import { MapPin, Ruler, Home, TreePine, Sun, Droplets, Leaf, Wifi, Shield, Brain, Heart, Eye, Building2, TrendingUp, MapPinned, Mountain } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import plan1 from '@/assets/plan-1.jpg';
import plan2 from '@/assets/plan-2.jpg';
import plan3 from '@/assets/plan-3.jpg';

const projectFeatures = [
  {
    icon: MapPin,
    label: 'Ubicación',
    value: 'Corregidora',
    subvalue: 'Querétaro'
  },
  {
    icon: Ruler,
    label: 'Superficie',
    value: '289.66 m²',
    subvalue: 'Terreno total'
  },
  {
    icon: Home,
    label: 'Proyecto',
    value: 'Casa Acocui',
    subvalue: 'Segunda casa modelo'
  },
  {
    icon: TreePine,
    label: 'Concepto',
    value: 'Off-grid',
    subvalue: 'Vivienda regenerativa'
  }
];

// Tab 1 - Soberanía
const sovereigntyFeatures = [
  {
    icon: Sun,
    title: 'Sistema fotovoltaico de 5kW',
    description: 'Con respaldo de baterías para autonomía energética completa.'
  },
  {
    icon: Droplets,
    title: 'Captación pluvial',
    description: 'Aproximadamente 50,000 litros anuales de agua de lluvia.'
  },
  {
    icon: Leaf,
    title: 'Biodigestor',
    description: 'Tratamiento de aguas grises y residuos orgánicos.'
  },
  {
    icon: Building2,
    title: 'Construcción bioclimática',
    description: 'Materiales locales y diseño adaptado al clima.'
  },
  {
    icon: TreePine,
    title: 'Huerto regenerativo',
    description: 'Áreas de permacultura y producción de alimentos.'
  },
  {
    icon: Wifi,
    title: 'Conectividad Starlink',
    description: 'Internet de alta velocidad sin depender de infraestructura local.'
  }
];

// Tab 2 - Cuidado Familiar
const familyCareFeatures = [
  {
    icon: Brain,
    title: 'IA doméstica local',
    description: 'Automatización inteligente que corre en el hogar, sin depender de la nube.'
  },
  {
    icon: Shield,
    title: 'Privacidad absoluta',
    description: 'Anonimización de datos y procesamiento local de información.'
  },
  {
    icon: Heart,
    title: 'Monitoreo de bienestar',
    description: 'Seguimiento de salud familiar en tiempo real con alertas personalizadas.'
  },
  {
    icon: Eye,
    title: 'Seguridad criptográfica',
    description: 'Protección avanzada de accesos y comunicaciones.'
  }
];

const smartSensors = [
  'Monitoreo por sistema y ecotecnia',
  'Notificaciones de mantenimiento preventivo',
  'Equipos inteligentes con potencial de generar ingresos'
];

// Tab 3 - Beneficios
const locationBenefits = [
  {
    icon: MapPinned,
    title: 'Corregidora, Querétaro',
    description: 'Zona de alto crecimiento con excelente conectividad a CDMX y el Bajío.'
  },
  {
    icon: Mountain,
    title: 'Entorno natural',
    description: 'Clima templado, vistas panorámicas y calidad de aire privilegiada.'
  },
  {
    icon: Building2,
    title: 'Servicios cercanos',
    description: 'Acceso a hospitales, escuelas, centros comerciales y aeropuerto.'
  },
  {
    icon: TrendingUp,
    title: 'Plusvalía',
    description: 'Zona con crecimiento sostenido y demanda de vivienda de calidad.'
  }
];

// Tab 4 - Proyecto Arquitectónico
const architecturalSpecs = {
  terreno: '289.66 m²',
  construccion: '~180 m² (estimado)',
  precioPorM2: '$18,000 - $22,000 MXN',
};

const unifiedDesignFeatures = [
  'Diseño arquitectónico integral con enfoque regenerativo',
  'Soberanía hídrica, eléctrica, alimentaria, y de gestión de residuos orgánicos',
  'Construcción bioclimática con materiales de la región y 50 años más durables que las tradicionales',
  'Bajo mantenimiento y alto desempeño térmico',
  'Pozos provenzales y techo como jardín polinizador',
  'Sistemas de monitoreo anonimizado de salud en tiempo real',
  'Se construirá para poner a rentar',
  'Servirá como casa muestra para los terrenos aledaños que no pueden construir por la falta de acceso a servicios públicos',
  'Integración de tecnología y cuidado familiar que incrementa el atractivo del inmueble ante un mercado que valora bienestar, privacidad y soberanía',
];

const galleryImages = [
  { src: plan1, alt: 'Plano arquitectónico planta baja', title: 'Planta Baja' },
  { src: plan2, alt: 'Plano arquitectónico planta alta', title: 'Planta Alta' },
  { src: plan3, alt: 'Cortes y elevaciones', title: 'Cortes' },
  { src: null, alt: 'Render exterior', title: 'Render Exterior' },
  { src: null, alt: 'Render interior', title: 'Render Interior' },
  { src: null, alt: 'Vista aérea', title: 'Vista Aérea' },
  { src: null, alt: 'Detalle de acabados', title: 'Acabados' },
  { src: null, alt: 'Áreas verdes', title: 'Áreas Verdes' },
  { src: null, alt: 'Video de la casa', title: 'Video' },
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
            Nuestra segunda casa · Corregidora, Querétaro · 289.66 m²
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

        {/* Tabbed content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Tabs defaultValue="soberania" className="w-full">
            <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-1.5 rounded-xl mb-6">
              <TabsTrigger 
                value="soberania" 
                className="flex-1 min-w-[120px] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm py-2.5 px-4 text-sm font-medium"
              >
                Soberanía
              </TabsTrigger>
              <TabsTrigger 
                value="cuidado" 
                className="flex-1 min-w-[120px] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm py-2.5 px-4 text-sm font-medium"
              >
                Cuidado Familiar
              </TabsTrigger>
              <TabsTrigger 
                value="beneficios" 
                className="flex-1 min-w-[120px] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm py-2.5 px-4 text-sm font-medium"
              >
                Beneficios
              </TabsTrigger>
              <TabsTrigger 
                value="arquitectonico" 
                className="flex-1 min-w-[120px] data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm py-2.5 px-4 text-sm font-medium"
              >
                Proyecto Arquitectónico
              </TabsTrigger>
            </TabsList>

            {/* Tab 1 - Soberanía */}
            <TabsContent value="soberania" className="mt-0">
              <Card className="border-border/50 shadow-soft">
                <CardContent className="p-6 lg:p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Autosuficiencia e Infraestructura Regenerativa
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Un espacio diseñado para operar de forma independiente, con tecnología que regenera más de lo que consume.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {sovereigntyFeatures.map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
                      >
                        <div className="p-2 rounded-lg bg-secondary/20 shrink-0">
                          <feature.icon className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{feature.title}</p>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2 - Cuidado Familiar */}
            <TabsContent value="cuidado" className="mt-0">
              <Card className="border-border/50 shadow-soft">
                <CardContent className="p-6 lg:p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Bienestar, Seguridad y Tecnología Doméstica Soberana
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Cuidado, tranquilidad y control total sobre tu hogar y tus datos.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    {familyCareFeatures.map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
                      >
                        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                          <feature.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{feature.title}</p>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-medium text-foreground mb-3">Sensores y Equipos Inteligentes</h4>
                    <ul className="space-y-2">
                      {smartSensors.map((sensor, index) => (
                        <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                          {sensor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3 - Beneficios */}
            <TabsContent value="beneficios" className="mt-0">
              <Card className="border-border/50 shadow-soft">
                <CardContent className="p-6 lg:p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Experiencia de Vida y Contexto Territorial
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Una ubicación privilegiada que combina naturaleza, servicios y potencial de crecimiento.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {locationBenefits.map((benefit, index) => (
                      <motion.div
                        key={benefit.title}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
                      >
                        <div className="p-2 rounded-lg bg-secondary/20 shrink-0">
                          <benefit.icon className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{benefit.title}</p>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                    <p className="text-sm text-foreground">
                      <strong>Ventaja clave:</strong> Querétaro es uno de los estados con mayor crecimiento económico en México, 
                      con alta demanda de vivienda de calidad y excelente calidad de vida para familias.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 4 - Proyecto Arquitectónico */}
            <TabsContent value="arquitectonico" className="mt-0">
              <Card className="border-border/50 shadow-soft">
                <CardContent className="p-6 lg:p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Valor del Activo y Apreciación
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Una inversión diseñada para crecer en valor y generar retornos a largo plazo.
                  </p>

                  {/* Gallery - 9 visual blocks */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {galleryImages.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="aspect-[4/3] rounded-lg overflow-hidden bg-muted relative group"
                      >
                        {image.src ? (
                          <img 
                            src={image.src} 
                            alt={image.alt}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-muted/80 border-2 border-dashed border-border">
                            <div className="p-2 rounded-lg bg-muted-foreground/10 mb-2">
                              <Building2 className="h-6 w-6 text-muted-foreground/50" />
                            </div>
                            <span className="text-xs text-muted-foreground/70 text-center px-2">{image.title}</span>
                          </div>
                        )}
                        {image.src && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                            <span className="text-xs text-white font-medium">{image.title}</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Specs grid */}
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-muted/50 text-center">
                      <p className="text-2xl font-bold text-foreground">{architecturalSpecs.terreno}</p>
                      <p className="text-sm text-muted-foreground">Terreno</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 text-center">
                      <p className="text-2xl font-bold text-foreground">{architecturalSpecs.construccion}</p>
                      <p className="text-sm text-muted-foreground">Construcción</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 text-center">
                      <p className="text-2xl font-bold text-foreground">{architecturalSpecs.precioPorM2}</p>
                      <p className="text-sm text-muted-foreground">Precio por m²</p>
                    </div>
                  </div>

                  {/* Unified Design & Features */}
                  <div className="p-5 rounded-lg bg-secondary/10 border border-secondary/20">
                    <ul className="space-y-3">
                      {unifiedDesignFeatures.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm text-foreground">
                          <div className="w-2 h-2 rounded-full bg-secondary shrink-0 mt-1.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
