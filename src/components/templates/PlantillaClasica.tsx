import React from 'react';
import { DatosFactura } from '../../types/factura';
import { usarCalculosFactura } from '../../hooks/usarCalculosFactura';
import { formatearMoneda } from '../../utils/moneda';

interface PropiedadesPlantillaClasica {
  factura: DatosFactura;
  calculos: ReturnType<typeof usarCalculosFactura>;
}

export const PlantillaClasica: React.FC<PropiedadesPlantillaClasica> = ({
  factura,
  calculos,
}) => {
  const { emisor, receptor, configuracion, pago } = factura;
  const colorAcento = configuracion.colorPrimario || '#1E293B';
  const esCotizacion = configuracion.tipoDocumento === 'cotizacion';

  return (
    <div className="hoja-a4 bg-white p-10 text-slate-900 flex flex-col justify-between shadow-xl text-[12px] leading-normal mx-auto font-serif">
      {/* SECCIÓN SUPERIOR: ENCABEZADO CLÁSICO CORPORATIVO */}
      <div className="space-y-5">
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
          <div className="space-y-1.5 max-w-[60%]">
            {emisor.logoUrl ? (
              <img
                src={emisor.logoUrl}
                alt={emisor.nombre}
                className="h-14 w-auto max-w-[220px] object-contain mb-2"
              />
            ) : null}
            <h1 className="text-xl font-bold uppercase tracking-wide text-slate-900">
              {emisor.nombre}
            </h1>
            <p className="font-mono text-xs font-semibold text-slate-700">
              {emisor.identificacionFiscal}
            </p>
            <div className="text-slate-600 text-[11px] space-y-0.5 font-sans">
              {emisor.direccion && <p>{emisor.direccion}</p>}
              {(emisor.ciudad || emisor.pais) && (
                <p>{[emisor.ciudad, emisor.pais].filter(Boolean).join(', ')}</p>
              )}
              {emisor.correo && <p>{emisor.correo}</p>}
              {emisor.telefono && <p>{emisor.telefono}</p>}
            </div>
          </div>

          {/* Cuadro de Metadatos de la Factura */}
          <div className="w-56 border-2 border-slate-900 rounded-sm overflow-hidden text-center font-sans">
            <div
              className="py-1.5 px-3 text-white font-bold text-xs uppercase tracking-wider"
              style={{ backgroundColor: colorAcento }}
            >
              {esCotizacion ? 'COTIZACIÓN' : 'FACTURA COMERCIAL'}
            </div>
            <div className="p-2 space-y-1 bg-slate-50">
              <p className="font-mono font-bold text-sm text-slate-900">
                N° {pago.numeroDocumento || '001'}
              </p>
              <div className="text-[10px] text-slate-600 border-t border-slate-300 pt-1 space-y-0.5 text-left px-1">
                <p>
                  <strong>Fecha:</strong> {pago.fechaEmision}
                </p>
                {pago.fechaVencimiento && (
                  <p>
                    <strong>Vence:</strong> {pago.fechaVencimiento}
                  </p>
                )}
                <p>
                  <strong>Moneda:</strong> {configuracion.divisa}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CUADROS PARALELOS: EMISOR Y RECEPTOR */}
        <div className="grid grid-cols-2 gap-4 font-sans text-xs">
          <div className="border border-slate-300 rounded-sm p-3 bg-slate-50/50">
            <span className="block font-bold text-[10px] uppercase tracking-wider text-slate-500 mb-1 border-b border-slate-200 pb-0.5">
              Empresa Emisora
            </span>
            <p className="font-bold text-slate-900">{emisor.nombre}</p>
            <p className="font-mono text-slate-700">{emisor.identificacionFiscal}</p>
            <p className="text-slate-600 text-[11px] mt-1">{emisor.direccion}</p>
          </div>

          <div className="border border-slate-300 rounded-sm p-3 bg-slate-50/50">
            <span className="block font-bold text-[10px] uppercase tracking-wider text-slate-500 mb-1 border-b border-slate-200 pb-0.5">
              Datos del Cliente / Facturar A:
            </span>
            <p className="font-bold text-slate-900">{receptor.nombre || 'Cliente'}</p>
            <p className="font-mono text-slate-700">{receptor.identificacionFiscal}</p>
            <p className="text-slate-600 text-[11px] mt-1">{receptor.direccion}</p>
            {receptor.correo && (
              <p className="text-slate-500 text-[10px]">{receptor.correo}</p>
            )}
          </div>
        </div>

        {/* TABLA FORMAL CON BORDES COMPLETOS */}
        <div className="overflow-hidden border border-slate-400 font-sans">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-200/90 text-slate-900 text-[11px] uppercase tracking-wider font-bold border-b border-slate-400">
                <th className="py-2 px-2.5 w-10 text-center border-r border-slate-400">#</th>
                <th className="py-2 px-3 border-r border-slate-400">Descripción del Bien o Servicio</th>
                <th className="py-2 px-2.5 w-14 text-center border-r border-slate-400">Cant.</th>
                <th className="py-2 px-3 w-24 text-right border-r border-slate-400">Precio Unit.</th>
                <th className="py-2 px-2 w-16 text-center border-r border-slate-400">IVA</th>
                <th className="py-2 px-3 w-28 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 text-xs">
              {calculos.itemsCalculados.map((item, idx) => (
                <tr key={item.id} className="evitar-salto-pagina">
                  <td className="py-2 px-2.5 text-center font-mono border-r border-slate-300 text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="py-2 px-3 border-r border-slate-300">
                    <p className="font-semibold text-slate-900">{item.descripcion}</p>
                    {item.montoDescuento > 0 && (
                      <span className="text-[10px] text-rose-700 block">
                        Descuento aplicable: -
                        {formatearMoneda(item.montoDescuento, configuracion.divisa)}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono border-r border-slate-300">
                    {item.cantidad}
                  </td>
                  <td className="py-2 px-3 text-right font-mono border-r border-slate-300">
                    {formatearMoneda(item.montoUnitario, configuracion.divisa)}
                  </td>
                  <td className="py-2 px-2 text-center font-mono border-r border-slate-300 text-slate-600">
                    {(item.tasaImpuestoBps / 100).toFixed(0)}%
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                    {formatearMoneda(item.totalLinea, configuracion.divisa)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RESUMEN CONTABLE FORMAL */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-1 evitar-salto-pagina font-sans">
          <div className="md:col-span-7 space-y-2 text-xs border border-slate-300 p-3 rounded-sm bg-slate-50/40">
            <span className="font-bold uppercase text-[10px] tracking-wider text-slate-700 block border-b border-slate-200 pb-1">
              Instrucciones y Condiciones de Pago
            </span>
            <p>
              <strong>Forma de pago:</strong> {pago.metodoPago || 'A convenir'}
            </p>
            {pago.cuentaBancaria && (
              <p className="font-mono text-[11px] text-slate-800">
                <strong>Cuenta:</strong> {pago.cuentaBancaria}
              </p>
            )}
            {pago.notas && (
              <p className="text-[11px] text-slate-600 italic pt-1">
                <strong>Observaciones:</strong> {pago.notas}
              </p>
            )}
          </div>

          <div className="md:col-span-5 border border-slate-400 rounded-sm overflow-hidden text-xs">
            <div className="p-2.5 space-y-1.5 bg-slate-50">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Bruto:</span>
                <span className="font-mono">{calculos.subtotalBrutoFormateado}</span>
              </div>

              {calculos.totalDescuentos > 0 && (
                <div className="flex justify-between text-rose-700">
                  <span>Total Descuentos:</span>
                  <span className="font-mono">-{calculos.totalDescuentosFormateado}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Base Imponible:</span>
                <span className="font-mono">{calculos.baseGravableTotalFormateada}</span>
              </div>

              {calculos.desgloseImpuestos.map((d) => (
                <div key={d.tasaBps} className="flex justify-between text-slate-600">
                  <span>Impuesto ({d.porcentaje}%):</span>
                  <span className="font-mono">
                    +{formatearMoneda(d.montoImpuestoTotal, configuracion.divisa)}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-slate-200 p-2.5 border-t border-slate-400">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900">
                  TOTAL GENERAL:
                </span>
                <span className="font-mono text-base font-extrabold text-slate-900 border-b-4 border-double border-slate-900">
                  {calculos.totalPagarFormateado}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PIE DE PÁGINA CLÁSICO */}
      <div className="border-t border-slate-400 pt-3 mt-6 text-[10px] text-slate-600 flex justify-between items-center font-sans evitar-salto-pagina">
        <p className="max-w-md">
          {pago.terminosCondiciones || 'Comprobante válido para fines contables y comerciales.'}
        </p>
        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
          Facturación Certificada • Formato Oficial
        </span>
      </div>
    </div>
  );
};

