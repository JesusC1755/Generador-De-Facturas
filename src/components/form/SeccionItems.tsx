import React from 'react';
import { useFieldArray, UseFormReturn, Controller } from 'react-hook-form';
import { DatosFactura } from '../../types/factura';
import { DIVISAS_SOPORTADAS } from '../../types/divisa';
import {
  convertirACentavos,
  convertirDesdeCentavos,
  bpsAPorcentaje,
  porcentajeABps,
  calcularItemIndividual,
  formatearMoneda,
} from '../../utils/moneda';
import { generarIdUnico } from '../../utils/datosIniciales';
import { Boton } from '../ui/Boton';
import { Plus, Trash2, ListOrdered } from 'lucide-react';

interface PropiedadesSeccionItems {
  formulario: UseFormReturn<DatosFactura>;
}

export const SeccionItems: React.FC<PropiedadesSeccionItems> = ({ formulario }) => {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = formulario;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const divisaActiva = watch('configuracion.divisa') || 'USD';
  const configDivisa = DIVISAS_SOPORTADAS[divisaActiva] ?? DIVISAS_SOPORTADAS.USD;
  const itemsActuales = watch('items') || [];

  const agregarFilaItem = () => {
    append({
      id: generarIdUnico(),
      descripcion: '',
      cantidad: 1,
      montoUnitario: 0,
      tasaImpuestoBps: 1900, // 19% IVA por defecto
      tasaDescuentoBps: 0,
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <ListOrdered className="h-5 w-5 text-blue-600" />
          <h3 className="text-base font-semibold text-slate-800">
            Conceptos y Líneas de Facturación
          </h3>
        </div>
        <Boton
          type="button"
          variante="secundario"
          tamano="sm"
          onClick={agregarFilaItem}
        >
          <Plus className="h-4 w-4" />
          Agregar Concepto
        </Boton>
      </div>

      {errors.items?.root && (
        <p className="text-xs font-semibold text-rose-600">
          {errors.items.root.message}
        </p>
      )}

      <div className="space-y-3">
        {fields.map((campo, indice) => {
          const itemEnTiempoReal = itemsActuales[indice] ?? campo;
          const calculoFila = calcularItemIndividual(itemEnTiempoReal);

          return (
            <div
              key={campo.id}
              className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 transition-all hover:border-slate-300"
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-start">
                {/* Descripción */}
                <div className="md:col-span-5 space-y-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    Descripción del Servicio / Producto
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Consultoría técnica especializada"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    {...register(`items.${indice}.descripcion` as const)}
                  />
                  {errors.items?.[indice]?.descripcion && (
                    <p className="text-xs text-rose-600">
                      {errors.items[indice]?.descripcion?.message}
                    </p>
                  )}
                </div>

                {/* Cantidad */}
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    Cant.
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    {...register(`items.${indice}.cantidad` as const, {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                {/* Precio Unitario */}
                <div className="md:col-span-2 space-y-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    Precio ({configDivisa.simbolo})
                  </label>
                  <Controller
                    control={control}
                    name={`items.${indice}.montoUnitario` as const}
                    render={({ field }) => (
                      <input
                        type="number"
                        min="0"
                        step={configDivisa.decimales > 0 ? '0.01' : '1'}
                        value={convertirDesdeCentavos(
                          field.value,
                          configDivisa.factorUnidadMinima,
                          configDivisa.decimales
                        )}
                        onChange={(e) => {
                          const nuevoValorCentavos = convertirACentavos(
                            e.target.value,
                            configDivisa.factorUnidadMinima
                          );
                          field.onChange(nuevoValorCentavos);
                        }}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    )}
                  />
                </div>

                {/* Impuesto (%) */}
                <div className="md:col-span-1 space-y-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    IVA %
                  </label>
                  <Controller
                    control={control}
                    name={`items.${indice}.tasaImpuestoBps` as const}
                    render={({ field }) => (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={bpsAPorcentaje(field.value)}
                        onChange={(e) => {
                          const porcentaje = parseFloat(e.target.value) || 0;
                          field.onChange(porcentajeABps(porcentaje));
                        }}
                        className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    )}
                  />
                </div>

                {/* Descuento (%) */}
                <div className="md:col-span-1 space-y-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    Desc %
                  </label>
                  <Controller
                    control={control}
                    name={`items.${indice}.tasaDescuentoBps` as const}
                    render={({ field }) => (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={bpsAPorcentaje(field.value)}
                        onChange={(e) => {
                          const porcentaje = parseFloat(e.target.value) || 0;
                          field.onChange(porcentajeABps(porcentaje));
                        }}
                        className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    )}
                  />
                </div>

                {/* Acciones & Total de línea */}
                <div className="md:col-span-1 flex items-center justify-end pt-5">
                  <Boton
                    type="button"
                    variante="fantasma"
                    tamano="icono"
                    onClick={() => remove(indice)}
                    disabled={fields.length <= 1}
                    className="text-slate-400 hover:text-rose-600"
                    title={
                      fields.length <= 1
                        ? 'Debe existir al menos un ítem'
                        : 'Eliminar fila'
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Boton>
                </div>
              </div>

              {/* Subtotales en vivo de la línea */}
              <div className="mt-2.5 flex items-center justify-between border-t border-slate-200/60 pt-2 text-xs text-slate-500">
                <div className="flex gap-4">
                  <span>
                    Base:{' '}
                    <strong className="font-mono text-slate-700">
                      {formatearMoneda(calculoFila.baseGravable, divisaActiva)}
                    </strong>
                  </span>
                  {calculoFila.montoDescuento > 0 && (
                    <span className="text-rose-600">
                      Desc:{' '}
                      <strong className="font-mono">
                        -{formatearMoneda(calculoFila.montoDescuento, divisaActiva)}
                      </strong>
                    </span>
                  )}
                  {calculoFila.montoImpuesto > 0 && (
                    <span className="text-emerald-700">
                      IVA:{' '}
                      <strong className="font-mono">
                        +{formatearMoneda(calculoFila.montoImpuesto, divisaActiva)}
                      </strong>
                    </span>
                  )}
                </div>
                <div>
                  Total Línea:{' '}
                  <strong className="font-mono text-sm font-semibold text-slate-900">
                    {formatearMoneda(calculoFila.totalLinea, divisaActiva)}
                  </strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

