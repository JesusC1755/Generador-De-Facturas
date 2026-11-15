import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatosFactura, esquemaFactura } from '../../types/factura';
import { usarAlmacenFactura } from '../../store/usarAlmacenFactura';
import { SeccionConfiguracion } from './SeccionConfiguracion';
import { SeccionEmisor } from './SeccionEmisor';
import { SeccionReceptor } from './SeccionReceptor';
import { SeccionItems } from './SeccionItems';
import { SeccionPago } from './SeccionPago';
import { Boton } from '../ui/Boton';
import {
  descargarJsonFactura,
  leerArchivoComoTexto,
} from '../../utils/archivo';
import { Download, Upload, RotateCcw, Check, AlertCircle } from 'lucide-react';

interface PropiedadesFormularioFactura {
  alCambiarValoresEnVivo?: (datos: DatosFactura) => void;
}

export const FormularioFactura: React.FC<PropiedadesFormularioFactura> = ({
  alCambiarValoresEnVivo,
}) => {
  const facturaAlmacen = usarAlmacenFactura((state) => state.factura);
  const actualizarFacturaStore = usarAlmacenFactura((state) => state.actualizarFactura);
  const restablecerFacturaStore = usarAlmacenFactura((state) => state.restablecerFactura);
  const cargarDesdeJsonStore = usarAlmacenFactura((state) => state.cargarDesdeJson);

  const [mensajeEstado, setMensajeEstado] = useState<{
    tipo: 'exito' | 'error';
    texto: string;
  } | null>(null);

  const inputImportarJsonRef = useRef<HTMLInputElement>(null);
  const temporizadorDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const formulario = useForm<DatosFactura>({
    resolver: zodResolver(esquemaFactura),
    defaultValues: facturaAlmacen,
    mode: 'onChange',
  });

  const { watch, reset } = formulario;

  // Sincronizar si el store cambia externamente (ej: al cargar JSON)
  useEffect(() => {
    reset(facturaAlmacen);
  }, [facturaAlmacen, reset]);

  // Anti-Thrashing: Sincronización reactiva con debounce de 350ms hacia Zustand/LocalStorage
  useEffect(() => {
    const subscription = watch((valores) => {
      const datosCompletos = valores as DatosFactura;
      // Notificar de inmediato al lienzo visual para 60fps sin bloqueo
      if (alCambiarValoresEnVivo && datosCompletos.items) {
        alCambiarValoresEnVivo(datosCompletos);
      }

      // Amortiguar la escritura en disco I/O
      if (temporizadorDebounceRef.current) {
        clearTimeout(temporizadorDebounceRef.current);
      }

      temporizadorDebounceRef.current = setTimeout(() => {
        actualizarFacturaStore(datosCompletos);
      }, 350);
    });

    return () => {
      subscription.unsubscribe();
      if (temporizadorDebounceRef.current) {
        clearTimeout(temporizadorDebounceRef.current);
      }
    };
  }, [watch, actualizarFacturaStore, alCambiarValoresEnVivo]);

  const manejarDescargarJson = () => {
    const valoresActuales = formulario.getValues();
    descargarJsonFactura(valoresActuales);
    setMensajeEstado({
      tipo: 'exito',
      texto: 'Archivo .json exportado correctamente.',
    });
    setTimeout(() => setMensajeEstado(null), 3000);
  };

  const manejarImportarJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    try {
      const texto = await leerArchivoComoTexto(archivo);
      const resultado = cargarDesdeJsonStore(texto);

      if (resultado.exito) {
        setMensajeEstado({
          tipo: 'exito',
          texto: 'Factura restaurada exitosamente desde el archivo JSON.',
        });
      } else {
        setMensajeEstado({
          tipo: 'error',
          texto: resultado.error || 'Archivo inválido.',
        });
      }
    } catch {
      setMensajeEstado({
        tipo: 'error',
        texto: 'Error al intentar procesar el archivo JSON.',
      });
    }

    if (inputImportarJsonRef.current) {
      inputImportarJsonRef.current.value = '';
    }
    setTimeout(() => setMensajeEstado(null), 4000);
  };

  const manejarRestablecer = () => {
    if (window.confirm('¿Seguro que deseas restablecer el borrador a los valores iniciales?')) {
      restablecerFacturaStore();
      setMensajeEstado({
        tipo: 'exito',
        texto: 'Se ha restablecido el comprobante al estado inicial.',
      });
      setTimeout(() => setMensajeEstado(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Acciones de Portabilidad */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <div className="flex items-center gap-2">
          <Boton
            type="button"
            variante="esquema"
            tamano="sm"
            onClick={manejarDescargarJson}
            title="Exportar comprobante en formato .json"
          >
            <Download className="h-4 w-4 text-slate-500" />
            Exportar JSON
          </Boton>

          <input
            type="file"
            ref={inputImportarJsonRef}
            onChange={manejarImportarJson}
            accept=".json,application/json"
            className="hidden"
            id="importar-json"
          />
          <Boton
            type="button"
            variante="esquema"
            tamano="sm"
            onClick={() => inputImportarJsonRef.current?.click()}
            title="Importar un comprobante previo en .json"
          >
            <Upload className="h-4 w-4 text-slate-500" />
            Importar JSON
          </Boton>
        </div>

        <Boton
          type="button"
          variante="fantasma"
          tamano="sm"
          onClick={manejarRestablecer}
          className="text-slate-500 hover:text-slate-800"
          title="Restablecer todos los campos al borrador por defecto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Restablecer Borrador
        </Boton>
      </div>

      {/* Alerta de Notificaciones */}
      {mensajeEstado && (
        <div
          className={`flex items-center gap-2 rounded-lg p-3 text-xs font-medium ${
            mensajeEstado.tipo === 'exito'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {mensajeEstado.tipo === 'exito' ? (
            <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{mensajeEstado.texto}</span>
        </div>
      )}

      {/* Formulario Modular de Secciones */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <SeccionConfiguracion formulario={formulario} />
        <SeccionEmisor formulario={formulario} />
        <SeccionReceptor formulario={formulario} />
        <SeccionItems formulario={formulario} />
        <SeccionPago formulario={formulario} />
      </form>
    </div>
  );
};

