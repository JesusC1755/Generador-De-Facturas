import { DatosFactura } from '../types/factura';

/**
 * Generador de UUID compatible con entornos de navegador.
 */
export function generarIdUnico(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Fecha actual en formato YYYY-MM-DD.
 */
export function obtenerFechaActualIso(): string {
  return new Date().toISOString().split('T')[0] ?? '2026-01-01';
}

/**
 * Fecha de vencimiento por defecto (30 días después).
 */
export function obtenerFechaVencimientoIso(diasPlazo: number = 30): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + diasPlazo);
  return fecha.toISOString().split('T')[0] ?? '2026-01-31';
}

/**
 * Estado por defecto de una factura nueva.
 * Todos los montos se encuentran expresados en unidades mínimas enteras.
 */
export const FACTURA_INICIAL: DatosFactura = {
  id: generarIdUnico(),
  configuracion: {
    tipoDocumento: 'factura',
    plantilla: 'moderna',
    colorPrimario: '#2563EB', // Azul corporativo elegante
    divisa: 'USD',
  },
  emisor: {
    nombre: 'Acme Software Solutions S.A.',
    identificacionFiscal: 'NIT 900.123.456-7',
    correo: 'facturacion@acmesolutions.io',
    telefono: '+1 (555) 234-5678',
    direccion: 'Avenida Tecnológica 1024, Edificio Quantum Piso 5',
    ciudad: 'San Francisco, CA',
    pais: 'Estados Unidos',
    logoUrl: undefined,
  },
  receptor: {
    nombre: 'Global Logistics Partners Inc.',
    identificacionFiscal: 'EIN 12-3456789',
    correo: 'cuentasporpagar@globallogistics.com',
    telefono: '+1 (555) 987-6543',
    direccion: 'Boulevard Industrial 405, Suite 12B',
    ciudad: 'Austin, TX',
    pais: 'Estados Unidos',
  },
  items: [
    {
      id: generarIdUnico(),
      descripcion: 'Desarrollo de Arquitectura Cloud y Microservicios (Mes 1)',
      cantidad: 1,
      montoUnitario: 350000, // $3,500.00 USD
      tasaImpuestoBps: 1900, // 19% IVA
      tasaDescuentoBps: 500, // 5% Descuento especial
    },
    {
      id: generarIdUnico(),
      descripcion: 'Soporte y Monitoreo de Infraestructura 24/7 (Sprint)',
      cantidad: 2,
      montoUnitario: 75000, // $750.00 USD
      tasaImpuestoBps: 1900, // 19% IVA
      tasaDescuentoBps: 0,
    },
  ],
  pago: {
    numeroDocumento: 'FAC-2026-001',
    fechaEmision: obtenerFechaActualIso(),
    fechaVencimiento: obtenerFechaVencimientoIso(30),
    metodoPago: 'Transferencia Bancaria (Wire / ACH)',
    cuentaBancaria: 'Bank of America - Routing: 026009593 - Cta: 4830 1928 3749',
    notas: 'Agradecemos su preferencia. Por favor incluir el número de comprobante en la referencia del pago.',
    terminosCondiciones: 'El pago debe realizarse dentro de los 30 días posteriores a la fecha de emisión. Interés moratorio del 1.5% mensual.',
  },
};

