import { CodigoDivisa, DIVISAS_SOPORTADAS } from '../types/divisa';
import { ItemFactura } from '../types/factura';

/**
 * Re-escala los montos unitarios de los ítems al cambiar la divisa de la factura.
 * 
 * Previene el error de distorsión 100x al conmutar entre divisas con centavos (USD, EUR: factor 100)
 * y divisas zero-decimal en facturación comercial (COP, JPY: factor 1).
 *
 * Ejemplo:
 * - Ítem de $50.00 USD (montoUnitario: 5000 centavos)
 * - Al cambiar a COP, el valor nominal se preserva como $50 COP (montoUnitario: 50 unidades)
 *   en lugar de convertirse erróneamente en $5,000 COP.
 *
 * @param items Lista de ítems actuales en el comprobante
 * @param divisaAnterior Divisa de origen
 * @param divisaNueva Divisa de destino
 * @returns Lista de ítems con montoUnitario re-escalado determinísticamente
 */
export function reajustarMontosPorCambioDivisa(
  items: ItemFactura[],
  divisaAnterior: CodigoDivisa,
  divisaNueva: CodigoDivisa
): ItemFactura[] {
  if (divisaAnterior === divisaNueva) return items;

  const configAnterior = DIVISAS_SOPORTADAS[divisaAnterior] ?? DIVISAS_SOPORTADAS.USD;
  const configNueva = DIVISAS_SOPORTADAS[divisaNueva] ?? DIVISAS_SOPORTADAS.USD;

  // Si ambas tienen el mismo factor de unidad mínima, no se requiere re-escalar
  if (configAnterior.factorUnidadMinima === configNueva.factorUnidadMinima) {
    return items;
  }

  return items.map((item) => {
    // 1. Obtener el valor nominal mayor original sin pérdidas de precisión
    const valorNominalMayor = item.montoUnitario / configAnterior.factorUnidadMinima;
    // 2. Convertir al nuevo factor de unidad mínima entero
    const nuevoMontoUnitario = Math.round(valorNominalMayor * configNueva.factorUnidadMinima);

    return {
      ...item,
      montoUnitario: nuevoMontoUnitario,
    };
  });
}

