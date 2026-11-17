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
 * Función constructora para generar un estado inicial limpio (Lienzo en blanco / Blank Canvas).
 * Inicia vacía para que el usuario ingrese sus datos directamente sin fricción,
 * permitiendo cargar datos de prueba solo cuando él lo elija.
 */
export function crearFacturaInicial(): DatosFactura {
  return {
    id: generarIdUnico(),
    configuracion: {
      tipoDocumento: 'factura',
      plantilla: 'moderna',
      colorPrimario: '#2563EB',
      divisa: 'USD',
    },
    emisor: {
      nombre: '',
      identificacionFiscal: '',
      correo: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      pais: '',
      logoUrl: undefined,
    },
    receptor: {
      nombre: '',
      identificacionFiscal: '',
      correo: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      pais: '',
    },
    items: [
      {
        id: generarIdUnico(),
        descripcion: '',
        cantidad: 1,
        montoUnitario: 0,
        tasaImpuestoBps: 0,
        tasaDescuentoBps: 0,
      },
    ],
    pago: {
      numeroDocumento: '001',
      fechaEmision: obtenerFechaActualIso(),
      fechaVencimiento: obtenerFechaVencimientoIso(30),
      metodoPago: 'Transferencia bancaria',
      cuentaBancaria: '',
      notas: '',
      terminosCondiciones: '',
    },
  };
}

/**
 * Instancia inicial constante por defecto.
 */
export const FACTURA_INICIAL: DatosFactura = crearFacturaInicial();
