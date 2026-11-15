import React from 'react';
import { usarAlmacenFactura } from './store/usarAlmacenFactura';
import { calcularTotalesFactura, formatearMoneda } from './utils/moneda';
import { FileText, CheckCircle2, ShieldCheck, Database } from 'lucide-react';

export const Aplicacion: React.FC = () => {
  const factura = usarAlmacenFactura((state) => state.factura);
  const calculos = React.useMemo(() => calcularTotalesFactura(factura.items), [factura.items]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Barra superior de navegación */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm no-imprimir">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                InvoiceCraft
              </h1>
              <p className="text-xs text-slate-500">
                Generador Local-First de Facturas & Cotizaciones • Estándar Stripe
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              Precisión Financiera (Cero Flotantes)
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              <Database className="h-3.5 w-3.5" />
              Local-First Persistente
            </span>
          </div>
        </div>
      </header>

      {/* Contenido principal de verificación de Fase 1 */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-6 w-6 text-emerald-600 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-emerald-950">
                Fase 1 Completada: Cimientos, Graphify y Modelo Financiero
              </h2>
              <p className="mt-1 text-sm text-emerald-800">
                El entorno Vite + TypeScript + Tailwind CSS se encuentra activo. El motor de precisión contable opera 
                con enteros en unidades mínimas y puntos básicos (BPS). La persistencia con Zustand en LocalStorage 
                ha sido validada con estado puramente derivado.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Card: Datos Crudos del Estado */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-semibold text-slate-800">Estado Crudo Persistido (Zustand)</h3>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-600">
                {factura.configuracion.divisa}
              </span>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <span className="text-slate-500">Emisor:</span>{' '}
                <strong className="text-slate-800">{factura.emisor.nombre}</strong>
              </div>
              <div>
                <span className="text-slate-500">Receptor:</span>{' '}
                <strong className="text-slate-800">{factura.receptor.nombre}</strong>
              </div>
              <div>
                <span className="text-slate-500">Comprobante:</span>{' '}
                <span className="font-mono text-slate-700">{factura.pago.numeroDocumento}</span>
              </div>
              <div>
                <span className="text-slate-500">Ítems Crudos en Store:</span>{' '}
                <span className="font-semibold text-slate-800">{factura.items.length} líneas</span>
              </div>
            </div>
          </div>

          {/* Card: Motor Contable Derivado */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-semibold text-slate-800">Motor Contable Derivado (useMemo)</h3>
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                Determinista
              </span>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal Bruto:</span>
                <span className="font-mono font-medium text-slate-700">
                  {formatearMoneda(calculos.subtotalBruto, factura.configuracion.divisa)}
                </span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Descuentos Totales:</span>
                <span className="font-mono font-medium">
                  -{formatearMoneda(calculos.totalDescuentos, factura.configuracion.divisa)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Base Gravable:</span>
                <span className="font-mono font-medium text-slate-700">
                  {formatearMoneda(calculos.baseGravableTotal, factura.configuracion.divisa)}
                </span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span className="text-slate-500">Impuestos (IVA 19%):</span>
                <span className="font-mono font-medium">
                  +{formatearMoneda(calculos.totalImpuestos, factura.configuracion.divisa)}
                </span>
              </div>
              <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
                <span>Total a Pagar:</span>
                <span className="font-mono text-blue-600">
                  {formatearMoneda(calculos.totalPagar, factura.configuracion.divisa)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
