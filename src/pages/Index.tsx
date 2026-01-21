import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { AboutSection } from '@/components/landing/AboutSection';
import { LandInfoSection } from '@/components/landing/LandInfoSection';
import { DocumentsSection } from '@/components/landing/DocumentsSection';
import { GallerySection } from '@/components/landing/GallerySection';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { SimulatorPanel } from '@/components/landing/SimulatorPanel';

const Index = () => {
  const [simulatorTab, setSimulatorTab] = useState<'investment' | 'loan'>('investment');
  const simulatorRef = useRef<HTMLDivElement>(null);

  const scrollToSimulator = (tab: 'investment' | 'loan') => {
    setSimulatorTab(tab);
    simulatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero with header offset */}
        <div className="pt-16 lg:pt-20">
          <HeroSection 
            onSimulateInvestment={() => scrollToSimulator('investment')}
            onSimulateLoan={() => scrollToSimulator('loan')}
          />
        </div>

        {/* Main content - two columns on desktop */}
        <div className="container py-8 lg:py-16">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left column - content */}
            <div className="lg:col-span-3 space-y-0">
              <AboutSection />
              <LandInfoSection />
              <DocumentsSection />
              <GallerySection />
              <BenefitsSection />
            </div>

            {/* Right column - simulator (sticky on desktop) */}
            <div className="lg:col-span-2" ref={simulatorRef}>
              <div className="lg:sticky lg:top-24">
                <SimulatorPanel 
                  activeTab={simulatorTab}
                  onTabChange={setSimulatorTab}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
