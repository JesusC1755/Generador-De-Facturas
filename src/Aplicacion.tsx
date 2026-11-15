import React, { useState } from 'react';
import { usarAlmacenFactura } from './store/usarAlmacenFactura';
import { usarCalculosFactura } from './hooks/usarCalculosFactura';
import { FormularioFactura } from './components/form/FormularioFactura';
import { DatosFactura } from './types/factura';
import {
  FileText,
  ShieldCheck,
  Database,
  Sparkles,
  Calculator,
  Percent,
} from 'lucide-react';

export const Aplicacion: React.FC = () => {
  const facturaStore = usarAlmacenFactura((state) => state.factura);

  // Estado en vivo reflejado inmediatamente desde los inputs sin esperar el debounce
  const [facturaEnVivo, setFacturaEnVivo] = useState<DatosFactura>(facturaStore);

  const facturaActiva = facturaEnVivo || facturaStore;
  const calculos = usarCalculosFactura(
    facturaActiva.items,
    facturaActiva.configuracion.divisa
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      {/* Barra de navegación superior */}
      <header className="border-b border-slate-200 bg-white px-6 py-3.5 shadow-sm sticky top-0 z-30 no-imprimir">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white shadow"
              style={{ backgroundColor: facturaActiva.configuracion.colorPrimario }}
            >
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900">
                  InvoiceCraft
                </h1>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-600">
                  {facturaActiva.configuracion.tipoDocumento}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Generador Local-First con Precisión Financiera (Estándar Stripe)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              Cero Flotantes
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              <Database className="h-3.5 w-3.5" />
              Local-First
            </span>
          </div>
        </div>
      </header>

      {/* Espacio de trabajo Workspace Split-Screen */}
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Panel Izquierdo: Formulario Modular (7 columnas) */}
          <div className="lg:col-span-7 space-y-6">
            <FormularioFactura alCambiarValoresEnVivo={setFacturaEnVivo} />
          </div>

          {/* Panel Derecho: Resumen en Vivo del Motor Contable (5 columnas) */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
            {/* Tarjeta de Resumen Financiero en Vivo */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-800">
                    Motor Contable en Tiempo Real
                  </h3>
                </div>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 font-mono">
                  {facturaActiva.configuracion.divisa}
                </span>
              </div>

              {/* Métricas Principales */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Bruto ({calculos.itemsCalculados.length} conceptos):</span>
                  <span className="font-mono font-medium text-slate-900">
                    {calculos.subtotalBrutoFormateado}
                  </span>
                </div>

                {calculos.totalDescuentos > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Descuentos Aplicados:</span>
                    <span className="font-mono font-medium">
                      -{calculos.totalDescuentosFormateado}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Base Gravable Neta:</span>
                  <span className="font-mono font-medium text-slate-900">
                    {calculos.baseGravableTotalFormateada}
                  </span>
                </div>

                {/* Desglose de impuestos por tasa BPS */}
                {calculos.desgloseImpuestos.length > 0 ? (
                  <div className="space-y-1.5 rounded-lg bg-slate-50 p-2.5 text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Percent className="h-3 w-3" />
                      Desglose Fiscal de Impuestos (BPS):
                    </span>
                    {calculos.desgloseImpuestos.map((d) => (
                      <div
                        key={d.tasaBps}
                        className="flex justify-between text-slate-600 font-mono"
                      >
                        <span>
                          IVA {d.porcentaje}% ({d.tasaBps} bps) sobre base:
                        </span>
                        <span className="font-medium text-slate-800">
                          +{calculos.totalImpuestosFormateado}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-between text-slate-500 text-xs">
                    <span>Impuestos (0%):</span>
                    <span className="font-mono">$0.00</span>
                  </div>
                )}

                {/* Total Definitivo */}
                <div className="border-t border-slate-200 pt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-bold text-slate-900">
                      Gran Total a Pagar:
                    </span>
                    <span
                      className="font-mono text-2xl font-extrabold"
                      style={{ color: facturaActiva.configuracion.colorPrimario }}
                    >
                      {calculos.totalPagarFormateado}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner Informativo de Fase 2 hacia Fase 3 */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-xs text-blue-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-blue-950">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span>Próximo Paso: Fase 3 (Lienzo A4 Proporcional)</span>
              </div>
              <p className="text-blue-800 leading-relaxed">
                Este panel lateral integrará en la Fase 3 el visor proporcional A4 (210mm x 297mm)
                con la primera plantilla vectorial ('moderna') y renderizado reactivo a 60 FPS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
