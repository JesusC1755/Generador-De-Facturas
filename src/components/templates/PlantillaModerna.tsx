import React from 'react';
import { DatosFactura } from '../../types/factura';
import { usarCalculosFactura } from '../../hooks/usarCalculosFactura';
import { formatearMoneda } from '../../utils/moneda';

interface PropiedadesPlantillaModerna {
  factura: DatosFactura;
  calculos: ReturnType<typeof usarCalculosFactura>;
}

export const PlantillaModerna: React.FC<PropiedadesPlantillaModerna> = ({
  factura,
  calculos,
}) => {
  const { emisor, receptor, configuracion, pago } = factura;
  const colorAcento = configuracion.colorPrimario || '#2563EB';
  const esCotizacion = configuracion.tipoDocumento === 'cotizacion';

  return (
    <div className="hoja-a4 bg-white p-10 text-slate-800 flex flex-col justify-between shadow-xl text-[13px] leading-relaxed mx-auto">
      {/* SECCIÓN SUPERIOR: ENCABEZADO Y EMISOR */}
      <div className="space-y-6">
        <div className="flex items-start justify-between border-b border-slate-200 pb-6">
          {/* Logo o Identidad del Emisor */}
          <div className="max-w-[55%] space-y-2">
            {emisor.logoUrl ? (
              <img
                src={emisor.logoUrl}
                alt={emisor.nombre}
                className="h-14 w-auto max-w-[220px] object-contain"
              />
            ) : (
              <div
                className="flex h-12 w-12 items-center justify-center rounded-lg text-white font-bold text-xl shadow-sm"
                style={{ backgroundColor: colorAcento }}
              >
                {emisor.nombre.charAt(0).toUpperCase() || 'E'}
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {emisor.nombre}
              </h2>
              <p className="text-xs font-semibold text-slate-600 font-mono">
                {emisor.identificacionFiscal}
              </p>
            </div>
            <div className="text-xs text-slate-500 space-y-0.5">
              {emisor.direccion && <p>{emisor.direccion}</p>}
              {(emisor.ciudad || emisor.pais) && (
                <p>
                  {[emisor.ciudad, emisor.pais].filter(Boolean).join(', ')}
                </p>
              )}
              {emisor.correo && <p>{emisor.correo}</p>}
              {emisor.telefono && <p>{emisor.telefono}</p>}
            </div>
          </div>

          {/* Metadatos del Documento */}
          <div className="text-right space-y-2">
            <div>
              <span
                className="inline-block px-3 py-1 text-xs font-black uppercase tracking-wider rounded text-white"
                style={{ backgroundColor: colorAcento }}
              >
                {esCotizacion ? 'COTIZACIÓN' : 'FACTURA COMERCIAL'}
              </span>
              <p className="mt-1 font-mono text-xl font-extrabold text-slate-900 tracking-tight">
                #{pago.numeroDocumento || '001'}
              </p>
            </div>

            <div className="space-y-1 text-xs font-medium text-slate-600">
              <p>
                <span className="text-slate-400">Fecha de emisión:</span>{' '}
                <strong className="text-slate-800 font-mono">
                  {pago.fechaEmision}
                </strong>
              </p>
              {pago.fechaVencimiento && (
                <p>
                  <span className="text-slate-400">Vencimiento:</span>{' '}
                  <strong className="text-slate-800 font-mono">
                    {pago.fechaVencimiento}
                  </strong>
                </p>
              )}
              <p>
                <span className="text-slate-400">Moneda:</span>{' '}
                <strong className="text-slate-800 font-mono">
                  {configuracion.divisa}
                </strong>
              </p>
            </div>
          </div>
        </div>

        {/* DATOS DEL CLIENTE / RECEPTOR */}
        <div className="rounded-lg bg-slate-50/80 p-4 border border-slate-200/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            {esCotizacion ? 'Dirigido a:' : 'Facturado a:'}
          </span>
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {receptor.nombre || 'Nombre del Cliente'}
              </h3>
              <p className="font-mono text-xs text-slate-600 font-medium">
                {receptor.identificacionFiscal || 'ID Fiscal'}
              </p>
              {receptor.direccion && (
                <p className="text-xs text-slate-500 mt-0.5">{receptor.direccion}</p>
              )}
              {(receptor.ciudad || receptor.pais) && (
                <p className="text-xs text-slate-500">
                  {[receptor.ciudad, receptor.pais].filter(Boolean).join(', ')}
                </p>
              )}
            </div>

            <div className="text-right text-xs text-slate-500 space-y-0.5">
              {receptor.correo && <p>{receptor.correo}</p>}
              {receptor.telefono && <p>{receptor.telefono}</p>}
            </div>
          </div>
        </div>

        {/* TABLA DE ÍTEMS Y CONCEPTOS */}
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr
                className="text-white text-xs uppercase tracking-wider font-semibold"
                style={{ backgroundColor: colorAcento }}
              >
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                <th className="py-2.5 px-3">Descripción</th>
                <th className="py-2.5 px-3 w-16 text-center">Cant.</th>
                <th className="py-2.5 px-3 w-28 text-right">Precio Unit.</th>
                <th className="py-2.5 px-3 w-20 text-center">IVA</th>
                <th className="py-2.5 px-3 w-28 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {calculos.itemsCalculados.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`evitar-salto-pagina ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                  }`}
                >
                  <td className="py-2.5 px-3 text-center text-slate-400 font-mono">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">
                    <div>{item.descripcion || 'Sin descripción'}</div>
                    {item.montoDescuento > 0 && (
                      <span className="text-[11px] text-rose-600">
                        Desc. {(item.tasaDescuentoBps / 100).toFixed(1)}% (-
                        {formatearMoneda(item.montoDescuento, configuracion.divisa)})
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-700">
                    {item.cantidad}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                    {formatearMoneda(item.montoUnitario, configuracion.divisa)}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                    {(item.tasaImpuestoBps / 100).toFixed(0)}%
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
                    {formatearMoneda(item.totalLinea, configuracion.divisa)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BLOQUE DE TOTALES Y DESGLOSE FISCAL */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 evitar-salto-pagina">
          {/* Instrucciones de Pago y Notas */}
          <div className="md:col-span-7 space-y-3 text-xs">
            {pago.metodoPago && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <span className="font-semibold text-slate-700 block mb-1">
                  Método de Pago:
                </span>
                <p className="text-slate-600">{pago.metodoPago}</p>
                {pago.cuentaBancaria && (
                  <p className="font-mono text-slate-800 font-medium mt-1">
                    {pago.cuentaBancaria}
                  </p>
                )}
              </div>
            )}

            {pago.notas && (
              <div>
                <span className="font-semibold text-slate-700 block mb-0.5">
                  Notas Adicionales:
                </span>
                <p className="text-slate-500 italic leading-relaxed">
                  {pago.notas}
                </p>
              </div>
            )}
          </div>

          {/* Resumen Financiero Calculado */}
          <div className="md:col-span-5 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
              <span>Subtotal Bruto:</span>
              <span className="font-mono font-medium text-slate-800">
                {calculos.subtotalBrutoFormateado}
              </span>
            </div>

            {calculos.totalDescuentos > 0 && (
              <div className="flex justify-between py-1 border-b border-slate-100 text-rose-600">
                <span>Descuentos Totales:</span>
                <span className="font-mono font-medium">
                  -{calculos.totalDescuentosFormateado}
                </span>
              </div>
            )}

            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
              <span>Base Gravable:</span>
              <span className="font-mono font-medium text-slate-800">
                {calculos.baseGravableTotalFormateada}
              </span>
            </div>

            {/* Desglose de impuestos por tasa BPS */}
            {calculos.desgloseImpuestos.map((d) => (
              <div
                key={d.tasaBps}
                className="flex justify-between py-1 border-b border-slate-100 text-slate-600"
              >
                <span>IVA {d.porcentaje}% ({d.tasaBps} bps):</span>
                <span className="font-mono font-medium text-slate-800">
                  +{formatearMoneda(d.montoImpuestoTotal, configuracion.divisa)}
                </span>
              </div>
            ))}

            {/* Gran Total */}
            <div
              className="flex justify-between items-center rounded-lg p-3 text-white mt-2 shadow-sm"
              style={{ backgroundColor: colorAcento }}
            >
              <span className="font-bold text-sm tracking-wide">TOTAL A PAGAR:</span>
              <span className="font-mono text-base font-extrabold tracking-tight">
                {calculos.totalPagarFormateado}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PIE DE PÁGINA: TÉRMINOS Y AGRADECIMIENTO */}
      <div className="border-t border-slate-200 pt-4 mt-8 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 evitar-salto-pagina">
        <div>
          {pago.terminosCondiciones ? (
            <p className="max-w-xl text-slate-500">
              <strong className="text-slate-600">Términos:</strong>{' '}
              {pago.terminosCondiciones}
            </p>
          ) : (
            <p>Gracias por hacer negocios con nosotros.</p>
          )}
        </div>
        <div className="text-right font-mono text-[10px]">
          Generado con InvoiceCraft • Estándar Stripe
        </div>
      </div>
    </div>
  );
};

