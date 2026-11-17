import React, { useState, useRef, useEffect } from 'react';
import { normalizarTexto } from '../../utils/paises';
import { ChevronDown, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface OpcionAutocompletado {
  valor: string;
  etiqueta: string;
  icono?: string;
  subtitulo?: string;
}

export interface PropiedadesEntradaAutocompletado {
  etiqueta?: string;
  valor: string;
  alCambiar: (valor: string) => void;
  opciones: Array<OpcionAutocompletado | string>;
  placeholder?: string;
  error?: string;
  textoAyuda?: string;
  deshabilitado?: boolean;
  className?: string;
}

export const EntradaAutocompletado: React.FC<PropiedadesEntradaAutocompletado> = ({
  etiqueta,
  valor,
  alCambiar,
  opciones,
  placeholder,
  error,
  textoAyuda,
  deshabilitado = false,
  className,
}) => {
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);

  // Normalizar opciones a objetos estándar
  const opcionesNormalizadas: OpcionAutocompletado[] = opciones.map((opt) =>
    typeof opt === 'string'
      ? { valor: opt, etiqueta: opt }
      : opt
  );

  // Filtrar según lo que el usuario ha escrito
  const opcionesFiltradas = opcionesNormalizadas.filter((opt) => {
    if (!valor) return true;
    const query = normalizarTexto(valor);
    return (
      normalizarTexto(opt.etiqueta).includes(query) ||
      normalizarTexto(opt.valor).includes(query) ||
      (opt.subtitulo && normalizarTexto(opt.subtitulo).includes(query))
    );
  });

  // Cerrar al hacer clic fuera del componente
  useEffect(() => {
    const manejarClickFuera = (e: MouseEvent) => {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(e.target as Node)
      ) {
        setAbierto(false);
      }
    };
    document.addEventListener('mousedown', manejarClickFuera);
    return () => document.removeEventListener('mousedown', manejarClickFuera);
  }, []);

  const seleccionarOpcion = (opcion: OpcionAutocompletado) => {
    alCambiar(opcion.valor);
    setAbierto(false);
  };

  const limpiar = () => {
    alCambiar('');
  };

  return (
    <div ref={contenedorRef} className="relative w-full space-y-1">
      {etiqueta && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          {etiqueta}
        </label>
      )}

      <div className="relative">
        <input
          type="text"
          value={valor}
          disabled={deshabilitado}
          placeholder={placeholder}
          onFocus={() => setAbierto(true)}
          onChange={(e) => {
            alCambiar(e.target.value);
            setAbierto(true);
          }}
          className={twMerge(
            clsx(
              'w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 pr-14 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
              className
            )
          )}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
          {valor && !deshabilitado && (
            <button
              type="button"
              onClick={limpiar}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
              title="Borrar"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            disabled={deshabilitado}
            onClick={() => setAbierto(!abierto)}
            className="text-slate-400 hover:text-slate-600 p-0.5"
            tabIndex={-1}
          >
            <ChevronDown
              className={clsx(
                'h-4 w-4 transition-transform duration-150',
                abierto && 'rotate-180'
              )}
            />
          </button>
        </div>
      </div>

      {/* Menú flotante de coincidencias */}
      {abierto && !deshabilitado && opcionesFiltradas.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg text-sm focus:outline-none animate-in fade-in-50">
          {opcionesFiltradas.map((opcion) => (
            <li
              key={opcion.valor}
              onClick={() => seleccionarOpcion(opcion)}
              className={twMerge(
                clsx(
                  'flex items-center justify-between rounded-md px-2.5 py-1.5 cursor-pointer text-slate-800 transition-colors hover:bg-blue-50 hover:text-blue-900',
                  valor === opcion.valor && 'bg-blue-100/70 font-semibold text-blue-900'
                )
              )}
            >
              <div className="flex items-center gap-2">
                {opcion.icono && <span className="text-base">{opcion.icono}</span>}
                <span>{opcion.etiqueta}</span>
              </div>
              {opcion.subtitulo && (
                <span className="font-mono text-xs text-slate-500">
                  {opcion.subtitulo}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {textoAyuda && !error && (
        <p className="text-xs text-slate-500">{textoAyuda}</p>
      )}
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
};

