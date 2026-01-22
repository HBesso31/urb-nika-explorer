import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Send, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EXCHANGE_RATE_USD_TO_MXN, formatUSD, mxnToUsd } from '@/lib/simulatorConfig';
import type { Vehicle, Currency } from './PortalSimulator';

const transactionSchema = z.object({
  vehicle: z.enum(['investment', 'loan'], {
    required_error: 'Selecciona un vehículo',
  }),
  amountMXN: z.number({
    required_error: 'Ingresa un monto',
    invalid_type_error: 'El monto debe ser un número',
  }).positive('El monto debe ser mayor a 0'),
  network: z.string().optional(),
  financialContract: z.string().optional(),
  txHash: z.string().min(1, 'El hash de transacción es requerido'),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  defaultVehicle?: Vehicle;
  defaultAmountMXN?: number;
  defaultCurrency?: Currency;
  appUserId?: string;
  onSuccess?: () => void;
}

export function TransactionForm({ 
  defaultVehicle = 'investment', 
  defaultAmountMXN = 0,
  defaultCurrency = 'MXN',
  appUserId,
  onSuccess,
}: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      vehicle: defaultVehicle,
      amountMXN: defaultAmountMXN,
      network: '',
      financialContract: '',
      txHash: '',
    },
  });

  // Update form when simulator values change
  useEffect(() => {
    form.setValue('vehicle', defaultVehicle);
    form.setValue('amountMXN', defaultAmountMXN);
  }, [defaultVehicle, defaultAmountMXN, form]);

  const watchedAmount = form.watch('amountMXN');
  const amountUSD = watchedAmount ? mxnToUsd(watchedAmount) : 0;

  const onSubmit = async (data: TransactionFormValues) => {
    if (!appUserId) {
      toast.error('Debes iniciar sesión para registrar una transacción');
      return;
    }

    setIsSubmitting(true);

    // TODO: On-chain verification will be added here by dev
    // For now, all transactions are saved as 'pending'
    // The admin or an automated process will update to 'confirmed' after verification

    const { error } = await supabase.from('contributions').insert({
      app_user_id: appUserId,
      user_id: appUserId, // Using app_user_id as user_id for now
      vehicle: data.vehicle,
      amount_mxn: data.amountMXN,
      amount_usd: mxnToUsd(data.amountMXN),
      network: data.network || null,
      financial_contract: data.financialContract || null,
      tx_hash: data.txHash,
      status: 'pending',
    });

    setIsSubmitting(false);

    if (error) {
      console.error('Error saving contribution:', error);
      toast.error('Error al registrar transacción', { 
        description: error.message 
      });
      return;
    }

    toast.success('Transacción registrada (pendiente)', {
      description: 'Tu transacción será verificada pronto.',
    });

    // Reset form
    form.reset({
      vehicle: defaultVehicle,
      amountMXN: defaultAmountMXN,
      network: '',
      financialContract: '',
      txHash: '',
    });

    onSuccess?.();
  };

  const networkWarning = !form.watch('network');

  return (
    <Card className="shadow-soft border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          Registrar Transacción
        </CardTitle>
        <CardDescription>
          Ingresa los datos de tu transferencia para registrarla
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Vehicle */}
            <FormField
              control={form.control}
              name="vehicle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehículo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona vehículo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="investment">Inversión</SelectItem>
                      <SelectItem value="loan">Préstamo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amountMXN"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto (MXN)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    ≈ {formatUSD(amountUSD)} (TC: {EXCHANGE_RATE_USD_TO_MXN} MXN/USD)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Network */}
            <FormField
              control={form.control}
              name="network"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Red (Network)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ej: Ethereum, Arbitrum, Scroll" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Financial Contract */}
            <FormField
              control={form.control}
              name="financialContract"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contrato Financiero (opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Dirección del contrato o identificador" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TX Hash */}
            <FormField
              control={form.control}
              name="txHash"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hash de Transacción *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="0x..." 
                      className="font-mono text-sm"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    El hash único de tu transacción en la blockchain
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Network warning */}
            {networkWarning && (
              <Alert variant="default" className="bg-amber-500/10 border-amber-500/20">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-700 text-sm">
                  Recomendamos especificar la red para facilitar la verificación.
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || !appUserId}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Registrar Transacción
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
