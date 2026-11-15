import { useMemo } from 'react';
import { ItemFactura, ResultadoCalculosFactura } from '../types/factura';
import { CodigoDivisa } from '../types/divisa';
import { calcularTotalesFactura, formatearMoneda } from '../utils/moneda';

/**
 * Hook personalizado para derivar en tiempo real los cálculos fiscales de la factura.
 * 
 * Regla de Oro: Este estado NUNCA se persiste en Zustand ni en LocalStorage.
 * Se recalcula de forma puramente determinista y memoizada a partir de los ítems crudos.
 *
 * @param items Lista de ítems con cantidades, precios unitarios (centavos) y tasas (bps).
 * @param divisa Código de la divisa activa ('USD', 'COP', etc.) para formateo rápido.
 */
export function usarCalculosFactura(
  items: ItemFactura[],
  divisa: CodigoDivisa = 'USD'
): ResultadoCalculosFactura & {
  subtotalBrutoFormateado: string;
  totalDescuentosFormateado: string;
  baseGravableTotalFormateada: string;
  totalImpuestosFormateado: string;
  totalPagarFormateado: string;
} {
  const calculos = useMemo(() => {
    return calcularTotalesFactura(items);
  }, [items]);

  const formateos = useMemo(() => {
    return {
      subtotalBrutoFormateado: formatearMoneda(calculos.subtotalBruto, divisa),
      totalDescuentosFormateado: formatearMoneda(calculos.totalDescuentos, divisa),
      baseGravableTotalFormateada: formatearMoneda(calculos.baseGravableTotal, divisa),
      totalImpuestosFormateado: formatearMoneda(calculos.totalImpuestos, divisa),
      totalPagarFormateado: formatearMoneda(calculos.totalPagar, divisa),
    };
  }, [calculos, divisa]);

  return {
    ...calculos,
    ...formateos,
  };
}

