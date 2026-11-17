import React from 'react';
import { DatosFactura } from '../../types/factura';
import { usarCalculosFactura } from '../../hooks/usarCalculosFactura';
import { formatearMoneda } from '../../utils/moneda';

interface PropiedadesPlantillaMinimalista {
  factura: DatosFactura;
  calculos: ReturnType<typeof usarCalculosFactura>;
}

export const PlantillaMinimalista: React.FC<PropiedadesPlantillaMinimalista> = ({
  factura,
  calculos,
}) => {
  const { emisor, receptor, configuracion, pago } = factura;
  const colorAcento = configuracion.colorPrimario || '#1E293B';
  const esCotizacion = configuracion.tipoDocumento === 'cotizacion';

  return (
    <div className="hoja-a4 bg-white p-12 text-slate-900 flex flex-col justify-between shadow-xl text-[13px] leading-relaxed mx-auto font-sans">
      {/* SECCIÓN SUPERIOR: ENCABEZADO EDITORIAL */}
      <div className="space-y-8">
        <div className="flex items-start justify-between border-b border-slate-900/10 pb-8">
          <div className="space-y-3 max-w-[60%]">
            {emisor.logoUrl ? (
              <img
                src={emisor.logoUrl}
                alt={emisor.nombre}
                className="h-12 w-auto max-w-[200px] object-contain"
              />
            ) : (
              <h1
                className="text-2xl font-light tracking-tight"
                style={{ color: colorAcento }}
              >
                {emisor.nombre || 'Nombre de la Empresa'}
              </h1>
            )}

            <div className="text-xs text-slate-500 space-y-0.5">
              {emisor.identificacionFiscal && (
                <p className="font-mono text-slate-700 font-medium">
                  {emisor.identificacionFiscal}
                </p>
              )}
              {emisor.direccion && <p>{emisor.direccion}</p>}
              {(emisor.ciudad || emisor.pais) && (
                <p>{[emisor.ciudad, emisor.pais].filter(Boolean).join(', ')}</p>
              )}
              {emisor.correo && <p>{emisor.correo}</p>}
            </div>
          </div>

          <div className="text-right space-y-1">
            <span
              className="text-xs font-semibold tracking-widest uppercase block"
              style={{ color: colorAcento }}
            >
              {esCotizacion ? 'Cotización' : 'Factura'}
            </span>
            <p className="font-mono text-2xl font-light text-slate-900">
              #{pago.numeroDocumento || '001'}
            </p>
            <div className="text-xs text-slate-500 pt-2 space-y-0.5">
              <p>
                Emisión:{' '}
                <span className="font-mono text-slate-800">{pago.fechaEmision}</span>
              </p>
              {pago.fechaVencimiento && (
                <p>
                  Vencimiento:{' '}
                  <span className="font-mono text-slate-800">
                    {pago.fechaVencimiento}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* CLIENTE / RECEPTOR */}
        <div className="grid grid-cols-2 gap-8 text-xs">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              {esCotizacion ? 'Para:' : 'Facturar a:'}
            </span>
            <h3 className="font-semibold text-slate-900 text-sm">
              {receptor.nombre || 'Cliente'}
            </h3>
            <p className="font-mono text-slate-600 mt-0.5">
              {receptor.identificacionFiscal}
            </p>
            {receptor.direccion && <p className="text-slate-500">{receptor.direccion}</p>}
            {(receptor.ciudad || receptor.pais) && (
              <p className="text-slate-500">
                {[receptor.ciudad, receptor.pais].filter(Boolean).join(', ')}
              </p>
            )}
          </div>

          <div className="text-right text-slate-500 space-y-0.5 self-end">
            {receptor.correo && <p>{receptor.correo}</p>}
            {receptor.telefono && <p>{receptor.telefono}</p>}
          </div>
        </div>

        {/* TABLA DE ÍTEMS MINIMALISTA */}
        <div className="pt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900/10 text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                <th className="py-2 w-8 text-left">#</th>
                <th className="py-2">Descripción</th>
                <th className="py-2 w-16 text-center">Cant.</th>
                <th className="py-2 w-28 text-right">Precio</th>
                <th className="py-2 w-16 text-center">IVA</th>
                <th className="py-2 w-28 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {calculos.itemsCalculados.map((item, idx) => (
                <tr key={item.id} className="evitar-salto-pagina">
                  <td className="py-3 text-slate-400 font-mono text-[11px]">
                    {String(idx + 1).padStart(2, '0')}
                  </td>
                  <td className="py-3 pr-4 text-slate-800">
                    <div className="font-medium">{item.descripcion || 'Sin descripción'}</div>
                    {item.montoDescuento > 0 && (
                      <span className="text-[11px] text-rose-600 block mt-0.5">
                        Descuento {(item.tasaDescuentoBps / 100).toFixed(1)}% (-
                        {formatearMoneda(item.montoDescuento, configuracion.divisa)})
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-center font-mono text-slate-600">
                    {item.cantidad}
                  </td>
                  <td className="py-3 text-right font-mono text-slate-600">
                    {formatearMoneda(item.montoUnitario, configuracion.divisa)}
                  </td>
                  <td className="py-3 text-center font-mono text-slate-500">
                    {(item.tasaImpuestoBps / 100).toFixed(0)}%
                  </td>
                  <td className="py-3 text-right font-mono font-medium text-slate-900">
                    {formatearMoneda(item.totalLinea, configuracion.divisa)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RESUMEN CONTABLE EDITORIAL */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 evitar-salto-pagina">
          <div className="md:col-span-7 space-y-3 text-xs text-slate-500">
            {pago.metodoPago && (
              <div>
                <span className="font-semibold text-slate-700 block mb-0.5">
                  Información de Pago:
                </span>
                <p>{pago.metodoPago}</p>
                {pago.cuentaBancaria && (
                  <p className="font-mono text-slate-700 mt-0.5 font-medium">
                    {pago.cuentaBancaria}
                  </p>
                )}
              </div>
            )}

            {pago.notas && (
              <div>
                <span className="font-semibold text-slate-700 block mb-0.5">Notas:</span>
                <p className="italic">{pago.notas}</p>
              </div>
            )}
          </div>

          <div className="md:col-span-5 space-y-2 text-xs">
            <div className="flex justify-between py-1 text-slate-500">
              <span>Subtotal:</span>
              <span className="font-mono text-slate-800">
                {calculos.subtotalBrutoFormateado}
              </span>
            </div>

            {calculos.totalDescuentos > 0 && (
              <div className="flex justify-between py-1 text-rose-600">
                <span>Descuentos:</span>
                <span className="font-mono">
                  -{calculos.totalDescuentosFormateado}
                </span>
              </div>
            )}

            <div className="flex justify-between py-1 text-slate-500">
              <span>Base Gravable:</span>
              <span className="font-mono text-slate-800">
                {calculos.baseGravableTotalFormateada}
              </span>
            </div>

            {calculos.desgloseImpuestos.map((d) => (
              <div key={d.tasaBps} className="flex justify-between py-1 text-slate-500">
                <span>IVA {d.porcentaje}%:</span>
                <span className="font-mono text-slate-800">
                  +{formatearMoneda(d.montoImpuestoTotal, configuracion.divisa)}
                </span>
              </div>
            ))}

            <div
              className="flex justify-between items-baseline pt-3 mt-2 border-t-2"
              style={{ borderColor: colorAcento }}
            >
              <span className="font-semibold uppercase tracking-wider text-slate-900 text-xs">
                Total:
              </span>
              <span
                className="font-mono text-xl font-bold tracking-tight"
                style={{ color: colorAcento }}
              >
                {calculos.totalPagarFormateado}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PIE DE PÁGINA */}
      <div className="border-t border-slate-900/10 pt-6 mt-10 text-[11px] text-slate-400 flex justify-between items-center evitar-salto-pagina">
        <p className="max-w-md">
          {pago.terminosCondiciones || 'Gracias por su confianza y preferencia.'}
        </p>
        <span className="font-mono text-[10px] text-slate-400">
          Documento Comercial • InvoiceCraft
        </span>
      </div>
    </div>
  );
};

