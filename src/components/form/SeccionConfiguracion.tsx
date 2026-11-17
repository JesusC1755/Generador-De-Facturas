import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DatosFactura } from '../../types/factura';
import { CodigoDivisa, DIVISAS_SOPORTADAS } from '../../types/divisa';
import { reajustarMontosPorCambioDivisa } from '../../utils/conversionDivisa';
import { Sliders, Palette, Coins, FileCheck } from 'lucide-react';

interface PropiedadesSeccionConfiguracion {
  formulario: UseFormReturn<DatosFactura>;
}

const PALETAS_PREDEFINIDAS = [
  { nombre: 'Azul Real', valor: '#2563EB' },
  { nombre: 'Índigo B2B', valor: '#4F46E5' },
  { nombre: 'Esmeralda', valor: '#059669' },
  { nombre: 'Pizarra Clásica', valor: '#1E293B' },
  { nombre: 'Rubí Corporativo', valor: '#DC2626' },
  { nombre: 'Ámbar Cálido', valor: '#D97706' },
];

export const SeccionConfiguracion: React.FC<PropiedadesSeccionConfiguracion> = ({
  formulario,
}) => {
  const { register, watch, setValue } = formulario;
  const colorActual = watch('configuracion.colorPrimario');
  const divisaActual = watch('configuracion.divisa');

  const manejarCambioDivisa = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevaDivisa = e.target.value as CodigoDivisa;
    const itemsActuales = watch('items') || [];

    if (divisaActual !== nuevaDivisa) {
      // Re-escalar montos unitarios para preservar el valor nominal del usuario sin distorsión 100x
      const itemsReescalados = reajustarMontosPorCambioDivisa(
        itemsActuales,
        divisaActual,
        nuevaDivisa
      );
      setValue('items', itemsReescalados, { shouldDirty: true });
      setValue('configuracion.divisa', nuevaDivisa, { shouldDirty: true });
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Sliders className="h-5 w-5 text-blue-600" />
        <h3 className="text-base font-semibold text-slate-800">
          Configuración del Documento y Estilo
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Tipo de Documento */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 whitespace-nowrap">
            <FileCheck className="h-3.5 w-3.5 text-slate-400" />
            Tipo de Comprobante
          </label>
          <select
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            {...register('configuracion.tipoDocumento')}
          >
            <option value="factura">Factura Comercial</option>
            <option value="cotizacion">Cotización / Proforma</option>
          </select>
        </div>

        {/* Divisa con re-escalado seguro */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 whitespace-nowrap">
            <Coins className="h-3.5 w-3.5 text-slate-400" />
            Moneda
          </label>
          <select
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={divisaActual}
            onChange={manejarCambioDivisa}
          >
            {Object.values(DIVISAS_SOPORTADAS).map((divisa) => (
              <option key={divisa.codigo} value={divisa.codigo}>
                {divisa.codigo} - {divisa.nombre} ({divisa.simbolo})
              </option>
            ))}
          </select>
        </div>

        {/* Plantilla (Nombres limpios sin paréntesis) */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 whitespace-nowrap">
            <Palette className="h-3.5 w-3.5 text-slate-400" />
            Plantilla A4
          </label>
          <select
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            {...register('configuracion.plantilla')}
          >
            <option value="moderna">Moderna</option>
            <option value="minimalista">Minimalista</option>
            <option value="clasica">Clásica</option>
          </select>
        </div>

        {/* Color Primario */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 whitespace-nowrap">
            Color de Acento
          </label>
          <div className="flex items-center gap-2 h-[34px]">
            <input
              type="color"
              value={colorActual || '#2563EB'}
              onChange={(e) =>
                setValue('configuracion.colorPrimario', e.target.value, {
                  shouldDirty: true,
                })
              }
              className="h-8 w-10 cursor-pointer rounded border border-slate-300 bg-white p-0.5"
              title="Selector de color personalizado"
            />
            <div className="flex gap-1.5">
              {PALETAS_PREDEFINIDAS.slice(0, 5).map((p) => (
                <button
                  key={p.valor}
                  type="button"
                  onClick={() =>
                    setValue('configuracion.colorPrimario', p.valor, {
                      shouldDirty: true,
                    })
                  }
                  className="h-6 w-6 rounded-full border border-black/10 transition-transform hover:scale-110 focus:outline-none"
                  style={{ backgroundColor: p.valor }}
                  title={p.nombre}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
