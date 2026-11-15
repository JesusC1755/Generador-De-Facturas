import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { DatosFactura } from '../../types/factura';
import { usarCalculosFactura } from '../../hooks/usarCalculosFactura';
import { PlantillaModerna } from '../templates/PlantillaModerna';
import { Boton } from '../ui/Boton';
import {
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
} from 'lucide-react';

interface PropiedadesContenedorA4 {
  factura: DatosFactura;
}

export const ContenedorA4: React.FC<PropiedadesContenedorA4> = ({ factura }) => {
  const calculos = usarCalculosFactura(factura.items, factura.configuracion.divisa);
  const elementoImpresionRef = useRef<HTMLDivElement>(null);

  // Nivel de zoom (1 = 100%, 0.8 = 80%, etc.)
  const [escala, setEscala] = useState<number>(0.85);

  const manejarImprimir = useReactToPrint({
    contentRef: elementoImpresionRef,
    documentTitle: `${factura.configuracion.tipoDocumento}_${factura.pago.numeroDocumento || '001'}`,
  });

  const aumentarZoom = () => setEscala((prev) => Math.min(prev + 0.1, 1.4));
  const disminuirZoom = () => setEscala((prev) => Math.max(prev - 0.1, 0.4));
  const restablecerZoom = () => setEscala(0.85);
  const ajustarPantalla = () => setEscala(0.7);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Barra de herramientas del visor A4 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm no-imprimir">
        <div className="flex items-center gap-1.5">
          <Boton
            type="button"
            variante="esquema"
            tamano="sm"
            onClick={disminuirZoom}
            title="Reducir zoom"
          >
            <ZoomOut className="h-4 w-4" />
          </Boton>

          <span className="min-w-[48px] text-center font-mono text-xs font-semibold text-slate-700">
            {Math.round(escala * 100)}%
          </span>

          <Boton
            type="button"
            variante="esquema"
            tamano="sm"
            onClick={aumentarZoom}
            title="Aumentar zoom"
          >
            <ZoomIn className="h-4 w-4" />
          </Boton>

          <Boton
            type="button"
            variante="fantasma"
            tamano="sm"
            onClick={restablecerZoom}
            title="Restablecer tamaño normal"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Boton>

          <Boton
            type="button"
            variante="fantasma"
            tamano="sm"
            onClick={ajustarPantalla}
            title="Ajustar a la vista"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Boton>
        </div>

        {/* Botón de Impresión / Descarga PDF Vectorial */}
        <Boton
          type="button"
          variante="primario"
          tamano="sm"
          onClick={() => manejarImprimir()}
          className="shadow-sm"
          title="Exportar a PDF vectorial con react-to-print"
        >
          <Printer className="h-4 w-4" />
          <span>Imprimir / Guardar PDF</span>
        </Boton>
      </div>

      {/* Visor con fondo neutro de mesa de trabajo y scroll horizontal/vertical */}
      <div className="flex-1 overflow-auto rounded-xl border border-slate-300 bg-slate-200/70 p-6 flex justify-center items-start min-h-[750px]">
        <div
          style={{
            transform: `scale(${escala})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="transition-transform duration-150"
        >
          {/* Nodo físico para impresión */}
          <div ref={elementoImpresionRef}>
            {/* Renderizado de la plantilla activa */}
            <PlantillaModerna factura={factura} calculos={calculos} />
          </div>
        </div>
      </div>
    </div>
  );
};

