import { z } from 'zod';
import { CodigoDivisa } from './divisa';

/**
 * Esquema de validación para un ítem de factura o cotización.
 * Los montos monetarios se expresan en unidades mínimas enteras (centavos).
 * Las tasas de impuestos y descuentos se expresan en puntos básicos (1% = 100 bps).
 */
export const esquemaItemFactura = z.object({
  id: z.string().uuid(),
  descripcion: z.string().default(''),
  cantidad: z.number().int().positive('La cantidad debe ser un entero positivo'),
  /**
   * Monto en unidad mínima (ej. 1550 para $15.50 USD o 1550 para $1550 COP).
   */
  montoUnitario: z.number().int().nonnegative('El precio unitario no puede ser negativo'),
  /**
   * Puntos básicos para impuesto (1900 bps = 19%).
   */
  tasaImpuestoBps: z.number().int().min(0, 'La tasa de impuesto no puede ser negativa').max(10000, 'Máximo 100%'),
  /**
   * Puntos básicos para descuento (500 bps = 5%).
   */
  tasaDescuentoBps: z.number().int().min(0, 'El descuento no puede ser negativo').max(10000, 'Máximo 100%'),
});

export type ItemFactura = z.infer<typeof esquemaItemFactura>;

/**
 * Entidad Emisor (quien genera la factura/cotización).
 */
export const esquemaEmisor = z.object({
  nombre: z.string().default(''),
  identificacionFiscal: z.string().default(''),
  correo: z.string().email('Correo electrónico inválido').or(z.literal('')),
  telefono: z.string().default(''),
  direccion: z.string().default(''),
  ciudad: z.string().default(''),
  pais: z.string().default(''),
  /**
   * Data URL en formato Base64 (máx 1.5 MB verificado en cliente).
   */
  logoUrl: z.string().optional(),
});

export type DatosEmisor = z.infer<typeof esquemaEmisor>;

/**
 * Entidad Receptor (cliente final o empresa destinataria).
 */
export const esquemaReceptor = z.object({
  nombre: z.string().default(''),
  identificacionFiscal: z.string().default(''),
  correo: z.string().email('Correo electrónico inválido').or(z.literal('')),
  telefono: z.string().default(''),
  direccion: z.string().default(''),
  ciudad: z.string().default(''),
  pais: z.string().default(''),
});

export type DatosReceptor = z.infer<typeof esquemaReceptor>;

/**
 * Configuración visual y regional del documento.
 */
export type TipoDocumento = 'factura' | 'cotizacion';
export type TipoPlantilla = 'moderna' | 'minimalista' | 'clasica';

export const esquemaConfiguracion = z.object({
  tipoDocumento: z.enum(['factura', 'cotizacion']),
  plantilla: z.enum(['moderna', 'minimalista', 'clasica']),
  colorPrimario: z.string().regex(/^#([0-9A-Fa-f]{3}){1,2}$/, 'Color hexadecimal inválido'),
  divisa: z.custom<CodigoDivisa>((val) => typeof val === 'string' && ['USD', 'EUR', 'COP', 'MXN', 'GBP'].includes(val)),
});

export type ConfiguracionFactura = z.infer<typeof esquemaConfiguracion>;

/**
 * Términos de pago y metadatos del comprobante.
 */
export const esquemaPago = z.object({
  numeroDocumento: z.string().default('001'),
  fechaEmision: z.string(), // ISO YYYY-MM-DD
  fechaVencimiento: z.string(), // ISO YYYY-MM-DD
  metodoPago: z.string().default('Transferencia bancaria'),
  cuentaBancaria: z.string().default(''),
  notas: z.string().default(''),
  terminosCondiciones: z.string().default(''),
});

export type DatosPago = z.infer<typeof esquemaPago>;

/**
 * Estado crudo completo de la factura persistido en Zustand / LocalStorage.
 * NOTA CRÍTICA DE ARQUITECTURA: Subtotales, impuestos y totales NO se almacenan aquí.
 */
export const esquemaFactura = z.object({
  id: z.string().uuid(),
  configuracion: esquemaConfiguracion,
  emisor: esquemaEmisor,
  receptor: esquemaReceptor,
  items: z.array(esquemaItemFactura).min(1, 'Debe incluir al menos un ítem'),
  pago: esquemaPago,
});

export type DatosFactura = z.infer<typeof esquemaFactura>;

/**
 * Resultados matemáticos derivados puros de una línea de ítem.
 */
export interface ItemFacturaCalculado extends ItemFactura {
  /**
   * cantidad * montoUnitario
   */
  subtotalBruto: number;
  /**
   * (subtotalBruto * tasaDescuentoBps) / 10000 redondeado al entero más cercano
   */
  montoDescuento: number;
  /**
   * subtotalBruto - montoDescuento
   */
  baseGravable: number;
  /**
   * (baseGravable * tasaImpuestoBps) / 10000 redondeado al entero más cercano
   */
  montoImpuesto: number;
  /**
   * baseGravable + montoImpuesto
   */
  totalLinea: number;
}

/**
 * Desglose consolidado por tasa de impuesto para cumplimiento fiscal.
 */
export interface DesgloseImpuesto {
  tasaBps: number;
  porcentaje: number;
  baseGravableTotal: number;
  montoImpuestoTotal: number;
}

/**
 * Resultado completo del motor contable derivado para la factura.
 * Todo valor monetario está en enteros de unidad mínima.
 */
export interface ResultadoCalculosFactura {
  itemsCalculados: ItemFacturaCalculado[];
  subtotalBruto: number;
  totalDescuentos: number;
  baseGravableTotal: number;
  totalImpuestos: number;
  desgloseImpuestos: DesgloseImpuesto[];
  totalPagar: number;
}

