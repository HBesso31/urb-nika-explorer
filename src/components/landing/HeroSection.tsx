import heroImage from '@/assets/hero-urbanika.jpg';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Wallet } from 'lucide-react';

interface HeroSectionProps {
  onSimulateInvestment: () => void;
  onSimulateLoan: () => void;
}

export function HeroSection({ onSimulateInvestment, onSimulateLoan }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Urbánika eco-community aerial view" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-[70vh] flex items-center">
        <div className="container py-16 lg:py-24">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary-foreground">Inversión Regenerativa</span>
            </motion.div>
            
            {/* Title */}
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-display text-primary-foreground mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Construyendo el futuro,{' '}
              <span className="text-accent">juntos</span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              className="text-lg sm:text-xl text-primary-foreground/80 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Urbánika es un proyecto inmobiliario regenerativo diseñado para crear 
              comunidad y generar valor a largo plazo. Invierte o financia con confianza.
            </motion.p>
            
            {/* CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Button 
                variant="hero" 
                size="xl" 
                onClick={onSimulateInvestment}
                className="group"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                Simular Inversión
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <Button 
                variant="glass" 
                size="xl"
                onClick={onSimulateLoan}
                className="text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10"
              >
                <Wallet className="mr-2 h-5 w-5" />
                Simular Préstamo
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
