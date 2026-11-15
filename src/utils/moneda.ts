import { CodigoDivisa, DIVISAS_SOPORTADAS } from '../types/divisa';
import {
  DesgloseImpuesto,
  ItemFactura,
  ItemFacturaCalculado,
  ResultadoCalculosFactura,
} from '../types/factura';

/**
 * MOTOR DE PRECISIÓN FINANCIERA (ESTÁNDAR STRIPE / CERO FLOTANTES)
 * 
 * Reglas matemáticas inquebrantables:
 * 1. Los montos se operan exclusivamente como enteros en su mínima unidad divisible.
 * 2. Las tasas (impuestos y descuentos) se operan en puntos básicos (100 bps = 1.00%).
 * 3. Redondeo determinista uniforme por ítem: Math.round((base * bps) / 10000).
 */

const BPS_BASE = 10000;

/**
 * Convierte una entrada decimal (string o número) a unidades mínimas enteras.
 * Evita el error IEEE 754 (ej. 19.99 * 100 === 1998.9999999999998).
 *
 * @param valor Cadena o número decimal ingresado por el usuario (ej: "19.99" o "150000")
 * @param factorUnidadMinima Factor de la divisa (100 para centavos, 1 para zero-decimal)
 * @returns Entero en unidades mínimas (ej: 1999)
 */
export function convertirACentavos(
  valor: string | number,
  factorUnidadMinima: number = 100
): number {
  if (typeof valor === 'number') {
    if (isNaN(valor)) return 0;
    return Math.round(valor * factorUnidadMinima);
  }

  const cadenaLimpia = valor.trim().replace(/,/g, '.');
  if (!cadenaLimpia) return 0;

  const flotante = parseFloat(cadenaLimpia);
  if (isNaN(flotante)) return 0;

  // Multiplicación con redondeo exacto al entero más próximo
  return Math.round(flotante * factorUnidadMinima);
}

/**
 * Convierte un monto en centavos a su representación decimal en formato cadena para inputs numéricos.
 *
 * @param centavos Entero en unidades mínimas (ej: 1999)
 * @param factorUnidadMinima Factor de la divisa (100 para USD, 1 para COP)
 * @param decimales Cantidad de decimales deseados (2 para USD, 0 para COP)
 * @returns Cadena formateada para input (ej: "19.99" o "150000")
 */
export function convertirDesdeCentavos(
  centavos: number,
  factorUnidadMinima: number = 100,
  decimales: number = 2
): string {
  if (isNaN(centavos)) return '0';
  const valorMayor = centavos / factorUnidadMinima;
  return valorMayor.toFixed(decimales);
}

/**
 * Convierte puntos básicos a porcentaje decimal legible.
 * Ej: 1900 bps -> 19%, 550 bps -> 5.5%
 */
export function bpsAPorcentaje(bps: number): number {
  return bps / 100;
}

/**
 * Convierte un porcentaje a puntos básicos enteros.
 * Ej: 19 -> 1900 bps, 5.5 -> 550 bps
 */
export function porcentajeABps(porcentaje: number): number {
  return Math.round(porcentaje * 100);
}

/**
 * Calcula el monto de descuento de un subtotal bruto dado su tasa en puntos básicos.
 * Redondeo al centavo más próximo.
 */
export function calcularDescuentoItem(subtotalBruto: number, tasaDescuentoBps: number): number {
  if (tasaDescuentoBps <= 0 || subtotalBruto <= 0) return 0;
  return Math.round((subtotalBruto * tasaDescuentoBps) / BPS_BASE);
}

/**
 * Calcula el monto de impuesto de una base gravable dada su tasa en puntos básicos.
 * Redondeo al centavo más próximo.
 */
export function calcularImpuestoItem(baseGravable: number, tasaImpuestoBps: number): number {
  if (tasaImpuestoBps <= 0 || baseGravable <= 0) return 0;
  return Math.round((baseGravable * tasaImpuestoBps) / BPS_BASE);
}

/**
 * Calcula determinísticamente los valores financieros de un solo ítem.
 */
export function calcularItemIndividual(item: ItemFactura): ItemFacturaCalculado {
  const subtotalBruto = Math.round(item.cantidad * item.montoUnitario);
  const montoDescuento = calcularDescuentoItem(subtotalBruto, item.tasaDescuentoBps);
  const baseGravable = Math.max(0, subtotalBruto - montoDescuento);
  const montoImpuesto = calcularImpuestoItem(baseGravable, item.tasaImpuestoBps);
  const totalLinea = baseGravable + montoImpuesto;

  return {
    ...item,
    subtotalBruto,
    montoDescuento,
    baseGravable,
    montoImpuesto,
    totalLinea,
  };
}

/**
 * MOTOR CONTABLE PRINCIPAL:
 * Función matemática pura que toma la lista de ítems crudos y genera
 * todos los totales y desgloses fiscales derivados.
 */
export function calcularTotalesFactura(items: ItemFactura[]): ResultadoCalculosFactura {
  let subtotalBruto = 0;
  let totalDescuentos = 0;
  let baseGravableTotal = 0;
  let totalImpuestos = 0;

  const itemsCalculados: ItemFacturaCalculado[] = [];
  const mapaDesglose = new Map<number, { base: number; impuesto: number }>();

  for (const item of items) {
    const itemCalc = calcularItemIndividual(item);
    itemsCalculados.push(itemCalc);

    subtotalBruto += itemCalc.subtotalBruto;
    totalDescuentos += itemCalc.montoDescuento;
    baseGravableTotal += itemCalc.baseGravable;
    totalImpuestos += itemCalc.montoImpuesto;

    // Agrupación de impuestos por tasa BPS
    if (item.tasaImpuestoBps > 0) {
      const acumulado = mapaDesglose.get(item.tasaImpuestoBps) ?? { base: 0, impuesto: 0 };
      acumulado.base += itemCalc.baseGravable;
      acumulado.impuesto += itemCalc.montoImpuesto;
      mapaDesglose.set(item.tasaImpuestoBps, acumulado);
    }
  }

  // Generar lista de desglose ordenada por tasa
  const desgloseImpuestos: DesgloseImpuesto[] = Array.from(mapaDesglose.entries())
    .sort(([tasaA], [tasaB]) => tasaA - tasaB)
    .map(([tasaBps, datos]) => ({
      tasaBps,
      porcentaje: bpsAPorcentaje(tasaBps),
      baseGravableTotal: datos.base,
      montoImpuestoTotal: datos.impuesto,
    }));

  const totalPagar = baseGravableTotal + totalImpuestos;

  return {
    itemsCalculados,
    subtotalBruto,
    totalDescuentos,
    baseGravableTotal,
    totalImpuestos,
    desgloseImpuestos,
    totalPagar,
  };
}

/**
 * Formatea un valor en unidades mínimas enteras utilizando Intl.NumberFormat nativo.
 *
 * @param montoEntero Monto en centavos (ej: 1999) o pesos (ej: 150000)
 * @param codigoDivisa Código ISO de la divisa (ej: 'USD', 'COP')
 * @returns Cadena con formato de moneda localizado (ej: "$19.99" o "$ 150.000")
 */
export function formatearMoneda(
  montoEntero: number,
  codigoDivisa: CodigoDivisa
): string {
  const config = DIVISAS_SOPORTADAS[codigoDivisa] ?? DIVISAS_SOPORTADAS.USD;
  const valorReal = montoEntero / config.factorUnidadMinima;

  try {
    return new Intl.NumberFormat(config.localizacion, {
      style: 'currency',
      currency: config.codigo,
      minimumFractionDigits: config.decimales,
      maximumFractionDigits: config.decimales,
    }).format(valorReal);
  } catch {
    // Respaldo en caso de fallo de localización
    return `${config.simbolo} ${valorReal.toFixed(config.decimales)}`;
  }
}

