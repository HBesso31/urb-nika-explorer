import { useState, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { ProblemSection } from '@/components/landing/ProblemSection';
import { SolutionSection } from '@/components/landing/SolutionSection';
import { ProjectSection } from '@/components/landing/ProjectSection';
import { NonFinancialBenefitsSection } from '@/components/landing/NonFinancialBenefitsSection';
import { GallerySection } from '@/components/landing/GallerySection';
import { SimulatorPanelV2 } from '@/components/landing/SimulatorPanelV2';
import { CTASection } from '@/components/landing/CTASection';

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
        {/* Hero */}
        <div className="pt-16 lg:pt-20">
          <HeroSection 
            onSimulateInvestment={() => scrollToSimulator('investment')}
            onSimulateLoan={() => scrollToSimulator('loan')}
          />
        </div>

        {/* Problem & Solution */}
        <ProblemSection />
        <SolutionSection />

        {/* Project & Simulator */}
        <div className="container py-8 lg:py-16">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left column - content */}
            <div className="lg:col-span-3 space-y-0">
              <ProjectSection />
              <NonFinancialBenefitsSection />
              <GallerySection />
            </div>

            {/* Right column - simulator */}
            <div className="lg:col-span-2" ref={simulatorRef}>
              <div className="lg:sticky lg:top-24">
                <SimulatorPanelV2 
                  activeTab={simulatorTab}
                  onTabChange={setSimulatorTab}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
