import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface PropiedadesBoton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'destructivo' | 'esquema' | 'fantasma';
  tamano?: 'sm' | 'md' | 'lg' | 'icono';
}

export const Boton = React.forwardRef<HTMLButtonElement, PropiedadesBoton>(
  ({ className, variante = 'primario', tamano = 'md', children, disabled, ...props }, ref) => {
    const estilosBase =
      'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50';

    const estilosVariante = {
      primario: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:bg-blue-800',
      secundario: 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300',
      destructivo: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm',
      esquema:
        'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 shadow-sm',
      fantasma: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    }[variante];

    const estilosTamano = {
      sm: 'h-8 px-2.5 text-xs gap-1.5',
      md: 'h-9 px-3.5 text-sm gap-2',
      lg: 'h-11 px-5 text-base gap-2.5',
      icono: 'h-8 w-8 p-0',
    }[tamano];

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={twMerge(clsx(estilosBase, estilosVariante, estilosTamano, className))}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Boton.displayName = 'Boton';

