import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Save, 
  Loader2,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { toast } from 'sonner';

const Admin = () => {
  const { settings, rawSettings, isLoading, updateSettings } = useSiteSettings();
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    urbanika_contact_email: '',
    urbanika_contact_whatsapp: '',
    humberto_contact_email: '',
    humberto_contact_whatsapp: '',
    terms_url: '',
  });
  const [formInitialized, setFormInitialized] = useState(false);

  // Initialize form when settings load
  if (!formInitialized && !isLoading && settings) {
    setFormData({
      urbanika_contact_email: settings.urbanika_contact_email,
      urbanika_contact_whatsapp: settings.urbanika_contact_whatsapp,
      humberto_contact_email: settings.humberto_contact_email,
      humberto_contact_whatsapp: settings.humberto_contact_whatsapp,
      terms_url: settings.terms_url,
    });
    setFormInitialized(true);
  }

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!rawSettings) {
      toast.error('No se encontraron configuraciones para actualizar');
      return;
    }

    setIsSaving(true);

    const { error } = await updateSettings(formData);

    setIsSaving(false);

    if (error) {
      toast.error('Error al guardar', { description: error });
    } else {
      toast.success('Configuración guardada', { 
        description: 'Los cambios se reflejarán en el portal de usuarios.' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                <span className="text-lg font-display font-bold text-primary-foreground">U</span>
              </div>
              <span className="font-display font-semibold">Urbánika</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium">Admin</span>
          </div>

          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </header>

      <main className="container py-8 lg:py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl lg:text-4xl font-display font-semibold mb-2">
            Configuración del Sitio
          </h1>
          <p className="text-muted-foreground mb-8">
            Administra los contactos y términos que se muestran a los usuarios
          </p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : !rawSettings ? (
          <Card className="shadow-soft">
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-amber-500" />
              <p className="text-lg font-medium mb-2">No se encontraron configuraciones</p>
              <p className="text-sm text-muted-foreground">
                La tabla site_settings está vacía. Crea un registro inicial en la base de datos.
              </p>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Contactos */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Información de Contacto
                </CardTitle>
                <CardDescription>
                  Estos datos se muestran en el portal de cada usuario
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contacto Urbánika */}
                <div className="p-4 rounded-lg border border-border bg-card">
                  <p className="font-medium mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Contacto Urbánika
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="urbanika_email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Correo electrónico
                      </Label>
                      <Input
                        id="urbanika_email"
                        type="email"
                        value={formData.urbanika_contact_email}
                        onChange={(e) => handleChange('urbanika_contact_email', e.target.value)}
                        placeholder="contacto@urbanika.mx"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="urbanika_whatsapp" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        WhatsApp / Celular
                      </Label>
                      <Input
                        id="urbanika_whatsapp"
                        type="tel"
                        value={formData.urbanika_contact_whatsapp}
                        onChange={(e) => handleChange('urbanika_contact_whatsapp', e.target.value)}
                        placeholder="+52 55 1234 5678"
                      />
                    </div>
                  </div>
                </div>

                {/* Contacto Humberto */}
                <div className="p-4 rounded-lg border border-border bg-card">
                  <p className="font-medium mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    Contacto Humberto
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="humberto_email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Correo electrónico
                      </Label>
                      <Input
                        id="humberto_email"
                        type="email"
                        value={formData.humberto_contact_email}
                        onChange={(e) => handleChange('humberto_contact_email', e.target.value)}
                        placeholder="humberto@urbanika.mx"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="humberto_whatsapp" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        WhatsApp / Celular
                      </Label>
                      <Input
                        id="humberto_whatsapp"
                        type="tel"
                        value={formData.humberto_contact_whatsapp}
                        onChange={(e) => handleChange('humberto_contact_whatsapp', e.target.value)}
                        placeholder="+52 55 8765 4321"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Términos y condiciones */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Términos y Condiciones
                </CardTitle>
                <CardDescription>
                  URL o enlace al documento de términos y condiciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="terms_url">URL del documento</Label>
                  <Input
                    id="terms_url"
                    type="url"
                    value={formData.terms_url}
                    onChange={(e) => handleChange('terms_url', e.target.value)}
                    placeholder="https://ejemplo.com/terminos.pdf"
                  />
                  <p className="text-xs text-muted-foreground">
                    Puede ser una URL externa o una ruta local (ej: /terminos.pdf)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Save button */}
            <div className="flex justify-end">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Guardar cambios
                  </>
                )}
              </Button>
            </div>

            {/* Last updated */}
            {rawSettings?.updated_at && (
              <p className="text-xs text-muted-foreground text-center">
                Última actualización: {new Date(rawSettings.updated_at).toLocaleString('es-MX')}
              </p>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Admin;
