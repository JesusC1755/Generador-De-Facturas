import React, { useState } from 'react';
import { usarAlmacenFactura } from './store/usarAlmacenFactura';
import { FormularioFactura } from './components/form/FormularioFactura';
import { ContenedorA4 } from './components/preview/ContenedorA4';
import { DatosFactura } from './types/factura';
import { FileText } from 'lucide-react';

export const Aplicacion: React.FC = () => {
  const facturaStore = usarAlmacenFactura((state) => state.factura);

  // Estado reactivo en vivo: se actualiza al instante desde el formulario para 60 FPS
  const [facturaEnVivo, setFacturaEnVivo] = useState<DatosFactura>(facturaStore);

  const facturaActiva = facturaEnVivo || facturaStore;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      {/* Barra superior de navegación */}
      <header className="border-b border-slate-200 bg-white px-6 py-3.5 shadow-sm sticky top-0 z-30 no-imprimir">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg text-white shadow transition-colors"
              style={{ backgroundColor: facturaActiva.configuracion.colorPrimario }}
            >
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                InvoiceCraft
              </h1>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-700 font-mono">
                {facturaActiva.configuracion.tipoDocumento}
              </span>
              <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 font-mono">
                Plantilla: {facturaActiva.configuracion.plantilla}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Espacio de trabajo Workspace Split-Screen */}
      <main className="mx-auto w-full max-w-[1700px] flex-1 px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12 items-start">
          {/* PANEL IZQUIERDO: CONFIGURACIÓN Y FORMULARIO MODULAR (5 columnas) */}
          <div className="xl:col-span-5 space-y-6 no-imprimir">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Panel de Configuración y Entrada
              </h2>
            </div>
            <FormularioFactura alCambiarValoresEnVivo={setFacturaEnVivo} />
          </div>

          {/* PANEL DERECHO: VISTA PREVIA A4 (7 columnas) */}
          <div className="xl:col-span-7 xl:sticky xl:top-20 space-y-4">
            <div className="flex items-center justify-between no-imprimir">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Vista Previa
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                {facturaActiva.configuracion.divisa} • 210mm × 297mm
              </span>
            </div>

            {/* Contenedor A4 escalable y listo para imprimir */}
            <ContenedorA4 factura={facturaActiva} />
          </div>
        </div>
      </main>
    </div>
  );
};
