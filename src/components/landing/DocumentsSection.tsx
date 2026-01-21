import { motion } from 'framer-motion';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { projectDocuments } from '@/lib/projectAssets';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function DocumentsSection() {
  const handleView = (url: string) => {
    if (url === '#') {
      // TODO: Show toast that document is not yet available
      alert('Este documento estará disponible próximamente');
      return;
    }
    window.open(url, '_blank');
  };

  const handleDownload = (url: string, title: string) => {
    if (url === '#') {
      alert('Este documento estará disponible próximamente');
      return;
    }
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.pdf`;
    link.click();
  };

  return (
    <section id="documentos" className="py-16 lg:py-24 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-display text-foreground mb-4">
            Documentación
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Transparencia total. Todos los documentos legales y técnicos del proyecto 
            disponibles para tu revisión.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="gradient-card border-border/50 hover-lift overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 shrink-0">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {doc.description}
                      </p>
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleView(doc.url)}
                          className="gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Ver
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownload(doc.url, doc.title)}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-sm text-muted-foreground text-center"
        >
          ¿Necesitas algún documento adicional?{' '}
          <a href="mailto:info@urbanika.mx" className="text-primary hover:underline">
            Contáctanos
          </a>
        </motion.p>
      </div>
    </section>
  );
}
