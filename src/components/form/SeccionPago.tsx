import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DatosFactura } from '../../types/factura';
import { EntradaTexto } from '../ui/EntradaTexto';
import { AreaTexto } from '../ui/AreaTexto';
import { CreditCard } from 'lucide-react';

interface PropiedadesSeccionPago {
  formulario: UseFormReturn<DatosFactura>;
}

export const SeccionPago: React.FC<PropiedadesSeccionPago> = ({ formulario }) => {
  const {
    register,
    formState: { errors },
  } = formulario;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <CreditCard className="h-5 w-5 text-emerald-600" />
        <h3 className="text-base font-semibold text-slate-800">
          Condiciones de Pago y Fechas
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <EntradaTexto
          etiqueta="Número de Comprobante"
          placeholder="Ej: FAC-2026-001"
          error={errors.pago?.numeroDocumento?.message}
          {...register('pago.numeroDocumento')}
        />
        <EntradaTexto
          etiqueta="Fecha de Emisión"
          type="date"
          error={errors.pago?.fechaEmision?.message}
          {...register('pago.fechaEmision')}
        />
        <EntradaTexto
          etiqueta="Fecha de Vencimiento"
          type="date"
          error={errors.pago?.fechaVencimiento?.message}
          {...register('pago.fechaVencimiento')}
        />
        <div className="sm:col-span-1">
          <EntradaTexto
            etiqueta="Método de Pago"
            placeholder="Transferencia / Tarjeta / Efectivo"
            {...register('pago.metodoPago')}
          />
        </div>
        <div className="sm:col-span-2">
          <EntradaTexto
            etiqueta="Información Bancaria / Cuenta de Depósito"
            placeholder="Banco, tipo de cuenta, número o código SWIFT/IBAN"
            {...register('pago.cuentaBancaria')}
          />
        </div>
        <div className="sm:col-span-3">
          <AreaTexto
            etiqueta="Notas Adicionales"
            placeholder="Notas al cliente, agradecimientos, instrucciones de envío..."
            rows={2}
            {...register('pago.notas')}
          />
        </div>
        <div className="sm:col-span-3">
          <AreaTexto
            etiqueta="Términos y Condiciones"
            placeholder="Plazos de garantía, intereses por mora, validez de la oferta..."
            rows={2}
            {...register('pago.terminosCondiciones')}
          />
        </div>
      </div>
    </div>
  );
};

