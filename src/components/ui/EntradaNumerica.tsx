import React, { useState } from 'react';

interface PropiedadesEntradaNumerica {
  valorFormateado: string;
  valorNumerico: number;
  alCambiarNumero: (valor: number | null) => void;
  alConfirmarInvalido?: () => void;
  permitirDecimales?: boolean;
  maxDecimales?: number;
  minimo?: number;
  maximo?: number;
  limpiarCeroAlEnfocar?: boolean;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

const TECLAS_BLOQUEADAS_BASE = new Set(['-', '+', 'e', 'E']);

/**
 * Entrada numérica controlada con borrador local durante el foco.
 * - Impide valores negativos y notación científica por teclado y pegado.
 * - Permite borrar libremente y escribir decimales sin saltos de cursor ni re-formateo agresivo.
 * - Formatea limpiamente al perder el foco (onBlur).
 */
export const EntradaNumerica: React.FC<PropiedadesEntradaNumerica> = ({
  valorFormateado,
  valorNumerico,
  alCambiarNumero,
  alConfirmarInvalido,
  permitirDecimales = false,
  maxDecimales = 2,
  minimo = 0,
  maximo,
  limpiarCeroAlEnfocar = false,
  placeholder = '0',
  className = '',
  ariaLabel,
}) => {
  const [enfocado, setEnfocado] = useState(false);
  const [borrador, setBorrador] = useState('');

  const sanearEntrada = (texto: string): string => {
    // Normalizar coma decimal a punto
    let limpio = texto.replace(/,/g, '.');

    if (!permitirDecimales) {
      // Solo dígitos enteros positivos (sin signos negativos ni puntos)
      return limpio.replace(/[^0-9]/g, '');
    }

    // Solo dígitos y punto decimal (elimina -, +, e, letras y símbolos)
    limpio = limpio.replace(/[^0-9.]/g, '');

    // Conservar únicamente el primer punto decimal
    const indicePunto = limpio.indexOf('.');
    if (indicePunto !== -1) {
      const parteEntera = limpio.slice(0, indicePunto);
      const parteDecimal = limpio
        .slice(indicePunto + 1)
        .replace(/\./g, '')
        .slice(0, maxDecimales);
      limpio = `${parteEntera}.${parteDecimal}`;
    }

    return limpio;
  };

  const manejarKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (TECLAS_BLOQUEADAS_BASE.has(e.key)) {
      e.preventDefault();
      return;
    }
    if (!permitirDecimales && (e.key === '.' || e.key === ',')) {
      e.preventDefault();
    }
  };

  const manejarFocus = () => {
    setEnfocado(true);
    if (limpiarCeroAlEnfocar && valorNumerico === 0) {
      setBorrador('');
    } else {
      setBorrador(valorFormateado);
    }
  };

  const manejarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let saneado = sanearEntrada(e.target.value);

    if (saneado === '' || saneado === '.') {
      setBorrador(saneado);
      alCambiarNumero(null);
      return;
    }

    const numero = permitirDecimales ? parseFloat(saneado) : parseInt(saneado, 10);
    if (!Number.isFinite(numero)) {
      return;
    }

    // Acotar al máximo permitido si está definido (ej. 100% en IVA/Descuento)
    if (maximo !== undefined && numero > maximo) {
      saneado = String(maximo);
      setBorrador(saneado);
      alCambiarNumero(maximo);
      return;
    }

    setBorrador(saneado);
    alCambiarNumero(numero);
  };

  const manejarBlur = () => {
    setEnfocado(false);

    if (borrador === '' || borrador === '.') {
      alConfirmarInvalido?.();
      return;
    }

    const numero = permitirDecimales ? parseFloat(borrador) : parseInt(borrador, 10);
    if (!Number.isFinite(numero) || numero < minimo) {
      alCambiarNumero(minimo);
      return;
    }

    if (maximo !== undefined && numero > maximo) {
      alCambiarNumero(maximo);
    }
  };

  return (
    <input
      type="text"
      inputMode={permitirDecimales ? 'decimal' : 'numeric'}
      autoComplete="off"
      value={enfocado ? borrador : valorFormateado}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onKeyDown={manejarKeyDown}
      onFocus={manejarFocus}
      onChange={manejarChange}
      onBlur={manejarBlur}
      className={className}
    />
  );
};

