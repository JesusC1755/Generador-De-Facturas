import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DatosFactura } from '../../types/factura';
import { EntradaTexto } from '../ui/EntradaTexto';
import { UserCheck } from 'lucide-react';

interface PropiedadesSeccionReceptor {
  formulario: UseFormReturn<DatosFactura>;
}

export const SeccionReceptor: React.FC<PropiedadesSeccionReceptor> = ({ formulario }) => {
  const {
    register,
    formState: { errors },
  } = formulario;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <UserCheck className="h-5 w-5 text-indigo-600" />
        <h3 className="text-base font-semibold text-slate-800">
          Datos del Receptor (Cliente)
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <EntradaTexto
          etiqueta="Nombre del Cliente o Empresa"
          placeholder="Ej: Innova Tech Ltd."
          error={errors.receptor?.nombre?.message}
          {...register('receptor.nombre')}
        />
        <EntradaTexto
          etiqueta="Identificación Fiscal del Cliente"
          placeholder="Ej: NIT / CIF / NIF"
          error={errors.receptor?.identificacionFiscal?.message}
          {...register('receptor.identificacionFiscal')}
        />
        <EntradaTexto
          etiqueta="Correo Electrónico del Cliente"
          type="email"
          placeholder="pagos@clientefinal.com"
          error={errors.receptor?.correo?.message}
          {...register('receptor.correo')}
        />
        <EntradaTexto
          etiqueta="Teléfono"
          placeholder="+1 (555) 000-0000"
          {...register('receptor.telefono')}
        />
        <div className="sm:col-span-2">
          <EntradaTexto
            etiqueta="Dirección"
            placeholder="Dirección fiscal o de entrega"
            {...register('receptor.direccion')}
          />
        </div>
        <EntradaTexto
          etiqueta="Ciudad"
          placeholder="Ciudad"
          {...register('receptor.ciudad')}
        />
        <EntradaTexto
          etiqueta="País"
          placeholder="País"
          {...register('receptor.pais')}
        />
      </div>
    </div>
  );
};

