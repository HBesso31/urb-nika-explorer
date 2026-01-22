import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Copy, Check, Loader2, ArrowRight, ArrowLeft, CheckCircle2, Wallet } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { formatMXN, formatUSD, mxnToUsd } from '@/lib/simulatorConfig';
import type { ContributionValues } from './ContributionSummary';

interface ContributionWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  depositAddress: string;
  values: ContributionValues;
  appUserId?: string;
  onSuccess: () => void;
}

export function ContributionWizard({
  open,
  onOpenChange,
  depositAddress,
  values,
  appUserId,
  onSuccess,
}: ContributionWizardProps) {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { getAccessToken } = usePrivy();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(depositAddress);
      setCopied(true);
      toast.success('Dirección copiada');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('No se pudo copiar');
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSave = async () => {
    if (!txHash.trim()) {
      toast.error('Ingresa el hash de tu transacción');
      return;
    }

    if (!appUserId) {
      toast.error('Error de autenticación');
      return;
    }

    setIsSubmitting(true);

    try {
      const accessToken = await getAccessToken();
      
      if (!accessToken) {
        toast.error('Error de autenticación', { 
          description: 'No se pudo obtener el token de acceso' 
        });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-contribution`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            appUserId,
            vehicle: values.vehicle,
            amountMxn: values.amountMXN,
            amountUsd: mxnToUsd(values.amountMXN),
            txHash: txHash.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error('Error saving contribution:', result);
        toast.error('No se pudo guardar. Intenta de nuevo.', { 
          description: result.error || 'Error desconocido' 
        });
        setIsSubmitting(false);
        return;
      }

      // Show success state
      setIsComplete(true);
      onSuccess();

    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('No se pudo guardar. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setStep(1);
    setTxHash('');
    setCopied(false);
    setIsComplete(false);
    onOpenChange(false);
  };

  const vehicleLabel = values.vehicle === 'investment' ? 'Inversión' : 'Préstamo';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isComplete ? '¡Gracias!' : `Aportar ${vehicleLabel}`}
          </DialogTitle>
          <DialogDescription>
            {isComplete 
              ? 'Tu aporte ha sido registrado' 
              : `${formatMXN(values.amountMXN)} (${formatUSD(values.amountUSD)})`}
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        {!isComplete && (
          <div className="flex items-center justify-center gap-2 py-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-8 rounded-full transition-colors ${
                  s === step 
                    ? 'bg-primary' 
                    : s < step 
                      ? 'bg-primary/50' 
                      : 'bg-muted'
                }`}
              />
            ))}
          </div>
        )}

        <div className="py-4">
          {/* Step 1: Deposit Address */}
          {step === 1 && !isComplete && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-1">Dirección de depósito</h3>
                <p className="text-sm text-muted-foreground">
                  Copia esta dirección para hacer tu transferencia
                </p>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border">
                <code className="flex-1 text-sm font-mono break-all">
                  {depositAddress}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <Button className="w-full gap-2" onClick={handleNext}>
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Instructions */}
          {step === 2 && !isComplete && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💸</span>
                </div>
                <h3 className="font-medium mb-1">Deposita desde tu wallet</h3>
                <p className="text-sm text-muted-foreground">
                  Desde tu wallet deposita a la dirección anterior.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-sm text-muted-foreground text-center">
                  Una vez que hayas hecho el depósito, continúa al siguiente paso para registrar el hash de tu transacción.
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                  Atrás
                </Button>
                <Button className="flex-1 gap-2" onClick={handleNext}>
                  Siguiente
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: TX Hash */}
          {step === 3 && !isComplete && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔗</span>
                </div>
                <h3 className="font-medium mb-1">Pega el hash de tu transacción</h3>
                <p className="text-sm text-muted-foreground">
                  El identificador único de tu transferencia en la blockchain
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="txHash">Hash de transacción *</Label>
                <Input
                  id="txHash"
                  placeholder="0x..."
                  className="font-mono text-sm"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                  Atrás
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleSave}
                  disabled={isSubmitting || !txHash.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Success State */}
          {isComplete && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-secondary" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">
                  Gracias y felicidades por aportar a este proyecto regenerativo
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tu aporte ha sido registrado y será verificado pronto.
                </p>
              </div>
              <Button className="w-full" onClick={handleClose}>
                Cerrar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
