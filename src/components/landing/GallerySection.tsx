import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryImages } from '@/lib/projectAssets';
import { Button } from '@/components/ui/button';

export function GallerySection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Create a 3x3 grid by repeating the 3 images
  const expandedImages = useMemo(() => {
    const repeated = [];
    for (let i = 0; i < 3; i++) {
      galleryImages.forEach((img, idx) => {
        repeated.push({
          ...img,
          id: `${img.id}-${i}`,
          originalIndex: idx,
        });
      });
    }
    return repeated;
  }, []);

  const openLightbox = (originalIndex: number) => setSelectedIndex(originalIndex);
  const closeLightbox = () => setSelectedIndex(null);

  const goToPrevious = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? galleryImages.length - 1 : selectedIndex - 1);
  };

  const goToNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === galleryImages.length - 1 ? 0 : selectedIndex + 1);
  };

  const selectedImage = selectedIndex !== null ? galleryImages[selectedIndex] : null;

  return (
    <section id="galeria" className="py-16 lg:py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-display text-foreground mb-4">
            Proyecto Arquitectónico
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Diseño sustentable que integra lo mejor de la arquitectura moderna con 
            prácticas regenerativas. Cada vivienda maximiza la luz natural y minimiza 
            el impacto ambiental.
          </p>
        </motion.div>

        {/* Gallery Grid - 3x3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {expandedImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
              className="group cursor-pointer"
              onClick={() => openLightbox(image.originalIndex)}
            >
              <div className="relative overflow-hidden rounded-xl shadow-soft aspect-[4/3]">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-lg font-semibold text-primary-foreground">
                    {image.title}
                  </h3>
                  {image.description && (
                    <p className="text-sm text-primary-foreground/80 mt-1">
                      {image.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Image */}
            <motion.div
              key={selectedImage.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl max-h-[80vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
              <div className="mt-4 text-center">
                <h3 className="text-xl font-display text-primary-foreground">
                  {selectedImage.title}
                </h3>
                {selectedImage.description && (
                  <p className="text-primary-foreground/70 mt-1">
                    {selectedImage.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
