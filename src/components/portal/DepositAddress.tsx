import { useState } from 'react';
import { Copy, Check, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DepositAddressProps {
  address: string | null | undefined;
  isLoading?: boolean;
}

export function DepositAddress({ address, isLoading }: DepositAddressProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!address) return;
    
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success('¡Dirección copiada!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('No se pudo copiar la dirección');
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-soft border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Dirección de Depósito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-12 bg-muted animate-pulse rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!address) {
    return (
      <Card className="shadow-soft border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Dirección de Depósito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
            <p className="text-sm text-muted-foreground">
              Dirección no disponible. Contacta al administrador.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Dirección de Depósito
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div className="flex-1 p-3 rounded-lg bg-muted/50 border border-border font-mono text-sm break-all">
            {address}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            className="shrink-0"
            aria-label="Copiar dirección"
          >
            {copied ? (
              <Check className="h-4 w-4 text-secondary" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Envía tu aportación a esta dirección y registra la transacción abajo.
        </p>
      </CardContent>
    </Card>
  );
}
