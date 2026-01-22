import { useState } from 'react';
import { Copy, Check, ExternalLink, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { formatMXN, formatUSD } from '@/lib/simulatorConfig';
import type { Contribution } from '@/hooks/useContributions';

interface UserTransactionsProps {
  contributions: Contribution[];
  isLoading?: boolean;
}

export function UserTransactions({ contributions, isLoading }: UserTransactionsProps) {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopyHash = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedHash(hash);
      toast.success('Hash copiado');
      setTimeout(() => setCopiedHash(null), 2000);
    } catch {
      toast.error('No se pudo copiar');
    }
  };

  const getVehicleName = (vehicle: string) => {
    return vehicle === 'investment' ? 'Inversión' : 'Préstamo';
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pendiente', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
      confirmed: { label: 'Confirmado', className: 'bg-secondary/10 text-secondary border-secondary/20' },
      failed: { label: 'Fallido', className: 'bg-destructive/10 text-destructive border-destructive/20' },
    };
    const c = config[status] || config.pending;
    return <Badge variant="outline" className={c.className}>{c.label}</Badge>;
  };

  const truncateHash = (hash: string | null) => {
    if (!hash) return '-';
    if (hash.length <= 16) return hash;
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Tus Transacciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (contributions.length === 0) {
    return (
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Tus Transacciones
          </CardTitle>
          <CardDescription>
            Historial de tus aportaciones registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Aún no tienes transacciones registradas</p>
            <p className="text-xs mt-1">Registra tu primera aportación arriba</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-soft border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Tus Transacciones
        </CardTitle>
        <CardDescription>
          Historial de tus aportaciones registradas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Red</TableHead>
                <TableHead>Tx Hash</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contributions.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(c.created_at)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      c.vehicle === 'investment' 
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'bg-secondary/10 text-secondary border-secondary/20'
                    }>
                      {getVehicleName(c.vehicle)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      <p className="font-medium">{formatMXN(Number(c.amount_mxn))}</p>
                      <p className="text-xs text-muted-foreground">{formatUSD(Number(c.amount_usd))}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.network || '-'}
                  </TableCell>
                  <TableCell>
                    {c.tx_hash ? (
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs">{truncateHash(c.tx_hash)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopyHash(c.tx_hash!)}
                        >
                          {copiedHash === c.tx_hash ? (
                            <Check className="h-3 w-3 text-secondary" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(c.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
