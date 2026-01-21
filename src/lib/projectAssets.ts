// Project assets configuration
// This file contains all the project assets (PDFs, images) that can be easily edited

import plan1 from '@/assets/plan-1.jpg';
import plan2 from '@/assets/plan-2.jpg';
import plan3 from '@/assets/plan-3.jpg';

export interface ProjectDocument {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'image';
  // For PDFs, this would be the URL to the actual file
  // Currently using placeholder URLs
  url: string;
  thumbnailUrl?: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description?: string;
}

export interface LandInfo {
  location: string;
  address: string;
  totalArea: string;
  usableArea: string;
  zoning: string;
  status: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Editable project documents
// TODO: Replace placeholder URLs with actual PDF files
export const projectDocuments: ProjectDocument[] = [
  {
    id: 'doc-1',
    title: 'Escritura del Terreno',
    description: 'Documento legal de propiedad del terreno',
    type: 'pdf',
    url: '#', // TODO: Replace with actual PDF URL
  },
  {
    id: 'doc-2',
    title: 'Plano Catastral',
    description: 'Plano oficial del registro catastral',
    type: 'pdf',
    url: '#', // TODO: Replace with actual PDF URL
  },
  {
    id: 'doc-3',
    title: 'Estudio de Factibilidad',
    description: 'Análisis de viabilidad del proyecto',
    type: 'pdf',
    url: '#', // TODO: Replace with actual PDF URL
  },
  {
    id: 'doc-4',
    title: 'Permiso de Uso de Suelo',
    description: 'Autorización municipal para desarrollo',
    type: 'pdf',
    url: '#', // TODO: Replace with actual PDF URL
  },
];

// Editable gallery images
export const galleryImages: GalleryImage[] = [
  {
    id: 'gallery-1',
    src: plan1,
    alt: 'Plano arquitectónico de casa tipo A',
    title: 'Casa Tipo A',
    description: 'Diseño sustentable de 2 recámaras con jardín integrado',
  },
  {
    id: 'gallery-2',
    src: plan2,
    alt: 'Renderizado 3D de casa ecológica',
    title: 'Render Exterior',
    description: 'Vista frontal con materiales naturales y techo verde',
  },
  {
    id: 'gallery-3',
    src: plan3,
    alt: 'Plan maestro de la comunidad',
    title: 'Plan Maestro',
    description: 'Distribución de la comunidad con áreas verdes y servicios',
  },
];

// Editable land information
export const landInfo: LandInfo = {
  location: 'Valle de Bravo, Estado de México',
  address: 'Carretera Valle de Bravo - Colorines, Km 5',
  totalArea: '12,500 m²',
  usableArea: '8,750 m²',
  zoning: 'H2 - Habitacional Densidad Media',
  status: 'Escrituras en orden, uso de suelo aprobado',
  coordinates: {
    lat: 19.1931,
    lng: -100.1316,
  },
};

// Project benefits (editable placeholder text)
export const projectBenefits = [
  {
    title: 'Retorno Atractivo',
    description: 'Proyección de rendimiento anual competitivo respaldado por activo inmobiliario real.',
    icon: 'trending-up',
  },
  {
    title: 'Impacto Regenerativo',
    description: 'Contribuye a un desarrollo que respeta y regenera el ecosistema local.',
    icon: 'leaf',
  },
  {
    title: 'Transparencia Total',
    description: 'Acceso completo a documentos, avances y estados financieros del proyecto.',
    icon: 'eye',
  },
  {
    title: 'Comunidad de Confianza',
    description: 'Inversión entre amigos y familia con gobernanza clara y participativa.',
    icon: 'users',
  },
];

// Simulator default values (configurable)
export const simulatorDefaults = {
  investment: {
    minAmount: 1000,
    maxAmount: 100000,
    defaultAmount: 10000,
    defaultTerm: 24, // months
    estimatedAnnualReturn: 12, // percentage
  },
  loan: {
    minAmount: 5000,
    maxAmount: 500000,
    defaultAmount: 50000,
    defaultTerm: 36, // months
    annualInterestRate: 8, // percentage
  },
};
