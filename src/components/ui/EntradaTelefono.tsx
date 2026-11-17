import React, { useState, useRef, useEffect, useMemo } from 'react';
import { LISTA_PAISES, InfoPais, normalizarTexto, buscarPais } from '../../utils/paises';
import { ChevronDown, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface PropiedadesEntradaTelefono {
  etiqueta?: string;
  valor: string;
  alCambiar: (valorCompleto: string) => void;
  paisSugerido?: string;
  placeholder?: string;
  error?: string;
  deshabilitado?: boolean;
  className?: string;
}

export const EntradaTelefono: React.FC<PropiedadesEntradaTelefono> = ({
  etiqueta,
  valor = '',
  alCambiar,
  paisSugerido,
  placeholder = '300 123 4567',
  error,
  deshabilitado = false,
  className,
}) => {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const inputBusquedaRef = useRef<HTMLInputElement>(null);

  const [popoverAbierto, setPopoverAbierto] = useState(false);
  const [filtroPais, setFiltroPais] = useState('');

  // Identificar el país y prefijo a partir del valor existente o del país sugerido
  const { paisDetectado, numeroLocal } = useMemo(() => {
    const valorLimpio = valor.trim();

    // 1. Intentar extraer coincidencia con prefijo existente en la cadena
    if (valorLimpio.startsWith('+')) {
      // Ordenar por longitud de prefijo descendente para evitar colisiones (ej: +1-809 vs +1)
      const paisesPorLongitud = [...LISTA_PAISES].sort(
        (a, b) => b.prefijo.length - a.prefijo.length
      );

      for (const p of paisesPorLongitud) {
        if (valorLimpio.startsWith(p.prefijo)) {
          const resto = valorLimpio.slice(p.prefijo.length).trim();
          return { paisDetectado: p, numeroLocal: resto };
        }
      }
    }

    // 2. Si no hay prefijo en el string pero hay un país sugerido del formulario
    if (paisSugerido) {
      const match = buscarPais(paisSugerido);
      if (match) {
        return { paisDetectado: match, numeroLocal: valorLimpio };
      }
    }

    // 3. Fallback: Colombia (+57)
    const porDefecto = LISTA_PAISES.find((p) => p.codigo === 'CO') || LISTA_PAISES[0]!;
    return { paisDetectado: porDefecto, numeroLocal: valorLimpio };
  }, [valor, paisSugerido]);

  const [paisActivo, setPaisActivo] = useState<InfoPais>(paisDetectado);

  // Sincronizar país activo si el país sugerido cambia y no hay número aún
  useEffect(() => {
    if (paisSugerido) {
      const match = buscarPais(paisSugerido);
      if (match && (!numeroLocal || !valor.startsWith('+'))) {
        setPaisActivo(match);
      }
    }
  }, [paisSugerido, numeroLocal, valor]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const manejarClickFuera = (e: MouseEvent) => {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(e.target as Node)
      ) {
        setPopoverAbierto(false);
      }
    };
    document.addEventListener('mousedown', manejarClickFuera);
    return () => document.removeEventListener('mousedown', manejarClickFuera);
  }, []);

  // Enfocar input de búsqueda al abrir
  useEffect(() => {
    if (popoverAbierto) {
      setTimeout(() => inputBusquedaRef.current?.focus(), 50);
    } else {
      setFiltroPais('');
    }
  }, [popoverAbierto]);

  const manejarCambioNumero = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoNumero = e.target.value;
    if (!nuevoNumero.trim()) {
      alCambiar('');
    } else {
      alCambiar(`${paisActivo.prefijo} ${nuevoNumero.trim()}`);
    }
  };

  const seleccionarPais = (nuevoPais: InfoPais) => {
    setPaisActivo(nuevoPais);
    setPopoverAbierto(false);
    if (numeroLocal) {
      alCambiar(`${nuevoPais.prefijo} ${numeroLocal}`);
    } else {
      alCambiar(`${nuevoPais.prefijo} `);
    }
  };

  // Filtrado en el popover
  const paisesFiltrados = LISTA_PAISES.filter((p) => {
    if (!filtroPais) return true;
    const query = normalizarTexto(filtroPais);
    return (
      normalizarTexto(p.nombre).includes(query) ||
      p.prefijo.includes(query) ||
      p.codigo.toLowerCase().includes(query)
    );
  });

  return (
    <div ref={contenedorRef} className="relative w-full space-y-1">
      {etiqueta && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          {etiqueta}
        </label>
      )}

      <div className="relative flex rounded-md shadow-sm">
        {/* Botón selector de prefijo con bandera */}
        <button
          type="button"
          disabled={deshabilitado}
          onClick={() => setPopoverAbierto(!popoverAbierto)}
          className={twMerge(
            clsx(
              'inline-flex items-center gap-1.5 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400',
              error && 'border-rose-500',
              className
            )
          )}
          title={`Prefijo para ${paisActivo.nombre}`}
        >
          <span className="text-base leading-none">{paisActivo.bandera}</span>
          <span className="font-mono">{paisActivo.prefijo}</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>

        {/* Input del número local */}
        <input
          type="tel"
          disabled={deshabilitado}
          value={numeroLocal}
          onChange={manejarCambioNumero}
          placeholder={placeholder}
          className={twMerge(
            clsx(
              'w-full rounded-r-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
            )
          )}
        />
      </div>

      {/* Popover con buscador de países y prefijos */}
      {popoverAbierto && (
        <div className="absolute z-50 mt-1 w-64 rounded-lg border border-slate-200 bg-white shadow-xl text-xs animate-in fade-in-50">
          {/* Buscador interno */}
          <div className="p-2 border-b border-slate-100 flex items-center gap-1.5 bg-slate-50 rounded-t-lg">
            <Search className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
            <input
              ref={inputBusquedaRef}
              type="text"
              value={filtroPais}
              onChange={(e) => setFiltroPais(e.target.value)}
              placeholder="Buscar país o prefijo (+57)..."
              className="w-full bg-transparent text-xs text-slate-900 focus:outline-none placeholder:text-slate-400"
            />
          </div>

          {/* Lista de países con prefijo */}
          <ul className="max-h-52 overflow-auto p-1 divide-y divide-slate-50">
            {paisesFiltrados.map((p) => (
              <li
                key={p.codigo}
                onClick={() => seleccionarPais(p)}
                className={twMerge(
                  clsx(
                    'flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition-colors hover:bg-blue-50',
                    paisActivo.codigo === p.codigo &&
                      'bg-blue-100/70 font-semibold text-blue-900'
                  )
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{p.bandera}</span>
                  <span className="text-slate-800">{p.nombre}</span>
                </div>
                <span className="font-mono text-slate-500 font-semibold">
                  {p.prefijo}
                </span>
              </li>
            ))}
            {paisesFiltrados.length === 0 && (
              <li className="p-3 text-center text-slate-400">
                No se encontraron países
              </li>
            )}
          </ul>
        </div>
      )}

      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
};

