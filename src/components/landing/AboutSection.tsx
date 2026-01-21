import { motion } from 'framer-motion';

export function AboutSection() {
  return (
    <section id="acerca" className="py-16 lg:py-24">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-display text-foreground mb-6">
              Sobre el Proyecto
            </h2>
            
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Urbánika</strong> nace de la visión de crear 
                un espacio donde la comunidad y la naturaleza coexisten en armonía. No es solo 
                un desarrollo inmobiliario — es un ecosistema diseñado para regenerar.
              </p>
              
              <p>
                Nuestro enfoque integra principios de <strong className="text-foreground">arquitectura 
                bioclimática</strong>, agricultura regenerativa y economía circular, creando un 
                modelo replicable de desarrollo sustentable.
              </p>
              
              <p>
                A diferencia de inversiones tradicionales, en Urbánika tu capital trabaja para 
                generar no solo retornos financieros, sino también <strong className="text-foreground">
                impacto social y ambiental positivo</strong>.
              </p>
            </div>

            <div className="mt-8 p-6 rounded-xl bg-secondary/10 border border-secondary/20">
              <p className="text-secondary font-medium italic">
                "Creemos que las mejores inversiones son aquellas que benefician a todos: 
                inversionistas, comunidad y planeta."
              </p>
              <p className="text-sm text-muted-foreground mt-2">— Equipo Fundador, Urbánika</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-6 rounded-xl gradient-card shadow-soft">
                  <p className="text-4xl font-display font-bold text-primary">12.5K</p>
                  <p className="text-sm text-muted-foreground mt-1">m² de terreno</p>
                </div>
                <div className="p-6 rounded-xl gradient-card shadow-soft">
                  <p className="text-4xl font-display font-bold text-primary">24</p>
                  <p className="text-sm text-muted-foreground mt-1">viviendas planeadas</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="p-6 rounded-xl gradient-card shadow-soft">
                  <p className="text-4xl font-display font-bold text-secondary">40%</p>
                  <p className="text-sm text-muted-foreground mt-1">áreas verdes</p>
                </div>
                <div className="p-6 rounded-xl gradient-card shadow-soft">
                  <p className="text-4xl font-display font-bold text-accent">100%</p>
                  <p className="text-sm text-muted-foreground mt-1">energía renovable</p>
                </div>
              </div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
