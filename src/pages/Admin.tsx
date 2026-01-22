import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Save, 
  Loader2,
  Mail,
  Phone,
  FileText,
  AlertCircle,
  ArrowLeft,
  ShieldAlert,
  Users,
  Wallet,
  Filter,
  RefreshCw,
  TrendingUp,
  Banknote,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useAdminCRM, VehicleFilter, StatusFilter } from '@/hooks/useAdminCRM';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const Admin = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { settings, rawSettings, isLoading, updateSettings } = useSiteSettings();
  const crm = useAdminCRM();
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    urbanika_contact_email: '',
    urbanika_contact_whatsapp: '',
    humberto_contact_email: '',
    humberto_contact_whatsapp: '',
    terms_url: '',
    deposit_address: '',
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
      deposit_address: settings.deposit_address,
    });
    setFormInitialized(true);
  }

  // Auth & role loading state
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="shadow-soft max-w-md mx-4">
          <CardContent className="py-12 text-center">
            <ShieldAlert className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Acceso Denegado</h2>
            <p className="text-muted-foreground mb-6">
              No tienes permisos de administrador para acceder a esta sección.
            </p>
            <Link to="/portal">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Ir al Portal
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
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

  const formatCurrency = (amount: number, currency: 'MXN' | 'USD') => {
    return new Intl.NumberFormat(currency === 'MXN' ? 'es-MX' : 'en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle className="h-3 w-3 mr-1" /> Confirmado</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Fallido</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Pendiente</Badge>;
    }
  };

  const getVehicleBadge = (vehicle: string) => {
    if (vehicle === 'loan') {
      return <Badge variant="outline" className="border-amber-500/50 text-amber-600"><Banknote className="h-3 w-3 mr-1" /> Préstamo</Badge>;
    }
    return <Badge variant="outline" className="border-primary/50 text-primary"><TrendingUp className="h-3 w-3 mr-1" /> Inversión</Badge>;
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

      <main className="container py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-display font-semibold mb-2">
            Panel de Administración
          </h1>
          <p className="text-muted-foreground">
            Gestiona usuarios, aportaciones y configuración del sitio
          </p>
        </motion.div>

        <Tabs defaultValue="crm" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="crm" className="gap-2">
              <Users className="h-4 w-4" />
              CRM
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          {/* CRM Tab */}
          <TabsContent value="crm" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Registros</p>
                        <p className="text-2xl font-bold">{crm.stats.totalRecords}</p>
                      </div>
                      <Users className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total MXN</p>
                        <p className="text-2xl font-bold">{formatCurrency(crm.stats.totalMXN, 'MXN')}</p>
                      </div>
                      <Banknote className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Confirmados</p>
                        <p className="text-2xl font-bold text-green-600">{crm.stats.confirmed}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500/50" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pendientes</p>
                        <p className="text-2xl font-bold text-amber-600">{crm.stats.pending}</p>
                      </div>
                      <Clock className="h-8 w-8 text-amber-500/50" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card className="shadow-soft">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Filter className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-lg">Filtros</CardTitle>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={crm.refresh}
                      disabled={crm.isLoading}
                      className="gap-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${crm.isLoading ? 'animate-spin' : ''}`} />
                      Actualizar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <div className="space-y-2">
                      <Label>Vehículo</Label>
                      <Select 
                        value={crm.vehicleFilter} 
                        onValueChange={(v) => crm.setVehicleFilter(v as VehicleFilter)}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="loan">Préstamo</SelectItem>
                          <SelectItem value="investment">Inversión</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select 
                        value={crm.statusFilter} 
                        onValueChange={(v) => crm.setStatusFilter(v as StatusFilter)}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="confirmed">Confirmado</SelectItem>
                          <SelectItem value="failed">Fallido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CRM Table */}
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Aportaciones de Usuarios
                  </CardTitle>
                  <CardDescription>
                    Registros de contribuciones ordenados por fecha (más recientes primero)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {crm.isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : crm.error ? (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                      <p className="text-muted-foreground">{crm.error}</p>
                    </div>
                  ) : crm.contributions.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-lg font-medium mb-1">No hay registros</p>
                      <p className="text-sm text-muted-foreground">
                        {crm.vehicleFilter !== 'all' || crm.statusFilter !== 'all' 
                          ? 'Intenta cambiar los filtros'
                          : 'Aún no hay contribuciones registradas'}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Método</TableHead>
                            <TableHead>Vehículo</TableHead>
                            <TableHead className="text-right">MXN</TableHead>
                            <TableHead className="text-right">USD</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Network</TableHead>
                            <TableHead>Contrato</TableHead>
                            <TableHead>Tx Hash</TableHead>
                            <TableHead>Fecha</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {crm.contributions.map((c) => (
                            <TableRow key={c.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">
                                    {c.user_name || 'Sin nombre'}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                                    {c.user_id.slice(0, 8)}...
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {c.registration_method === 'wallet' ? (
                                    <><Wallet className="h-3 w-3 mr-1" /> Wallet</>
                                  ) : (
                                    <><Mail className="h-3 w-3 mr-1" /> Email</>
                                  )}
                                </Badge>
                              </TableCell>
                              <TableCell>{getVehicleBadge(c.vehicle)}</TableCell>
                              <TableCell className="text-right font-mono">
                                {formatCurrency(c.amount_mxn, 'MXN')}
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {formatCurrency(c.amount_usd, 'USD')}
                              </TableCell>
                              <TableCell>{getStatusBadge(c.status)}</TableCell>
                              <TableCell>
                                <span className="text-sm text-muted-foreground">
                                  {c.network || '—'}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="text-xs font-mono text-muted-foreground truncate max-w-[80px] block">
                                  {c.financial_contract || '—'}
                                </span>
                              </TableCell>
                              <TableCell>
                                {c.tx_hash ? (
                                  <span className="text-xs font-mono text-primary truncate max-w-[80px] block">
                                    {c.tx_hash.slice(0, 10)}...
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-muted-foreground whitespace-nowrap">
                                  {new Date(c.created_at).toLocaleDateString('es-MX', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="max-w-3xl">
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
                {/* Dirección de depósito */}
                <Card className="shadow-soft border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-primary" />
                      Dirección de Depósito
                    </CardTitle>
                    <CardDescription>
                      Dirección pública donde los usuarios enviarán sus aportes (demo)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="deposit_address">Dirección pública</Label>
                      <Input
                        id="deposit_address"
                        type="text"
                        value={formData.deposit_address}
                        onChange={(e) => handleChange('deposit_address', e.target.value)}
                        placeholder="urbanika.eth o 0x..."
                        className="font-mono"
                      />
                      <p className="text-xs text-muted-foreground">
                        Puede ser un ENS name o una dirección de Ethereum
                      </p>
                    </div>
                  </CardContent>
                </Card>

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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
