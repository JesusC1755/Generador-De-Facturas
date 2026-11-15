import { DatosFactura } from '../types/factura';
import { generarIdUnico, obtenerFechaActualIso, obtenerFechaVencimientoIso } from './datosIniciales';

/**
 * Ejemplo 1: Factura de Servicios Cloud y Arquitectura (USD • Plantilla Moderna)
 */
export const FACTURA_EJEMPLO_SAAS: DatosFactura = {
  id: generarIdUnico(),
  configuracion: {
    tipoDocumento: 'factura',
    plantilla: 'moderna',
    colorPrimario: '#2563EB',
    divisa: 'USD',
  },
  emisor: {
    nombre: 'CloudScale Technologies LLC',
    identificacionFiscal: 'US-EIN 84-2918374',
    correo: 'billing@cloudscale.io',
    telefono: '+1 (415) 890-1234',
    direccion: '555 Mission Street, Suite 2400',
    ciudad: 'San Francisco, CA',
    pais: 'Estados Unidos',
    logoUrl: undefined,
  },
  receptor: {
    nombre: 'Finovate Capital Corp.',
    identificacionFiscal: 'US-EIN 13-9876543',
    correo: 'ap@finovate.com',
    telefono: '+1 (212) 555-7890',
    direccion: '350 5th Avenue, 42nd Floor',
    ciudad: 'New York, NY',
    pais: 'Estados Unidos',
  },
  items: [
    {
      id: generarIdUnico(),
      descripcion: 'Ingeniería de Plataforma Kubernetes & Automatización Terraform (Sprint Q1)',
      cantidad: 1,
      montoUnitario: 480000, // $4,800.00 USD
      tasaImpuestoBps: 825, // 8.25% Sales Tax
      tasaDescuentoBps: 500, // 5% Descuento por pago anticipado
    },
    {
      id: generarIdUnico(),
      descripcion: 'Auditoría de Seguridad y Pruebas de Penetración de APIs B2B',
      cantidad: 1,
      montoUnitario: 250000, // $2,500.00 USD
      tasaImpuestoBps: 825, // 8.25% Sales Tax
      tasaDescuentoBps: 0,
    },
    {
      id: generarIdUnico(),
      descripcion: 'Monitoreo de Infraestructura Datadog & SLA de Respuesta 99.9%',
      cantidad: 3,
      montoUnitario: 45000, // $450.00 USD x 3 = $1,350.00 USD
      tasaImpuestoBps: 825, // 8.25% Sales Tax
      tasaDescuentoBps: 0,
    },
  ],
  pago: {
    numeroDocumento: 'INV-2026-089',
    fechaEmision: obtenerFechaActualIso(),
    fechaVencimiento: obtenerFechaVencimientoIso(15),
    metodoPago: 'Transferencia ACH / Wire Directo',
    cuentaBancaria: 'Silicon Valley Bank • Routing: 121000358 • Cta: 8930 2198 4402',
    notas: 'Favor remitir el comprobante de transferencia a billing@cloudscale.io indicando el número INV-2026-089.',
    terminosCondiciones: 'Pago neto a 15 días calendario. Aplica un recargo del 1.5% mensual por retrasos no justificados.',
  },
};

/**
 * Ejemplo 2: Factura Comercial en Colombia (COP • Plantilla Clásica)
 */
export const FACTURA_EJEMPLO_COLOMBIA: DatosFactura = {
  id: generarIdUnico(),
  configuracion: {
    tipoDocumento: 'factura',
    plantilla: 'clasica',
    colorPrimario: '#059669',
    divisa: 'COP',
  },
  emisor: {
    nombre: 'Soluciones Digitales de Colombia S.A.S.',
    identificacionFiscal: 'NIT 901.458.923-4',
    correo: 'facturacion@solucionesdigitales.co',
    telefono: '+57 (601) 745-8890',
    direccion: 'Carrera 7 # 71-21, Torre B Oficina 801',
    ciudad: 'Bogotá D.C.',
    pais: 'Colombia',
    logoUrl: undefined,
  },
  receptor: {
    nombre: 'Distribuidora Andina de Alimentos S.A.',
    identificacionFiscal: 'NIT 860.034.901-2',
    correo: 'cuentasporpagar@andinaalimentos.com',
    telefono: '+57 (604) 444-1234',
    direccion: 'Zona Industrial Belén, Manzana 4 Bodega 12',
    ciudad: 'Medellín, Antioquia',
    pais: 'Colombia',
  },
  items: [
    {
      id: generarIdUnico(),
      descripcion: 'Licenciamiento de Software ERP en la Nube (50 Usuarios / Anualidad)',
      cantidad: 1,
      montoUnitario: 14500000, // $14.500.000 COP
      tasaImpuestoBps: 1900, // 19% IVA
      tasaDescuentoBps: 1000, // 10% Descuento comercial
    },
    {
      id: generarIdUnico(),
      descripcion: 'Capacitación Especializada y Parametrización de Módulos Financieros',
      cantidad: 2,
      montoUnitario: 1800000, // $1.800.000 COP x 2 = $3.600.000 COP
      tasaImpuestoBps: 1900, // 19% IVA
      tasaDescuentoBps: 0,
    },
  ],
  pago: {
    numeroDocumento: 'SETP-00452',
    fechaEmision: obtenerFechaActualIso(),
    fechaVencimiento: obtenerFechaVencimientoIso(30),
    metodoPago: 'Transferencia Bancolombia / PSE',
    cuentaBancaria: 'Bancolombia Cuenta Corriente N° 304-928192-12',
    notas: 'Resolución DIAN N° 187640001298 autorizada desde 2026-01-01 hasta 2027-01-01.',
    terminosCondiciones: 'Esta factura cambiaria de compraventa se asimila en sus efectos legales a una letra de cambio (Art. 774 Código de Comercio).',
  },
};

/**
 * Ejemplo 3: Cotización de Diseño y Branding (EUR • Plantilla Minimalista)
 */
export const COTIZACION_EJEMPLO_DISENO: DatosFactura = {
  id: generarIdUnico(),
  configuracion: {
    tipoDocumento: 'cotizacion',
    plantilla: 'minimalista',
    colorPrimario: '#1E293B',
    divisa: 'EUR',
  },
  emisor: {
    nombre: 'Studio Atelier Barcelona S.L.',
    identificacionFiscal: 'CIF B-67894523',
    correo: 'hola@atelierbcn.design',
    telefono: '+34 932 405 890',
    direccion: 'Passeig de Gràcia 45, Principal',
    ciudad: 'Barcelona',
    pais: 'España',
    logoUrl: undefined,
  },
  receptor: {
    nombre: 'Nordic Living Retail Group',
    identificacionFiscal: 'VAT SE556123456701',
    correo: 'procurement@nordicliving.se',
    telefono: '+46 8 123 4567',
    direccion: 'Kungsgatan 18',
    ciudad: 'Estocolmo',
    pais: 'Suecia',
  },
  items: [
    {
      id: generarIdUnico(),
      descripcion: 'Rediseño Integral de Identidad Visual de Marca y Manual de Estilo',
      cantidad: 1,
      montoUnitario: 320000, // 3.200,00 €
      tasaImpuestoBps: 2100, // 21% IVA España
      tasaDescuentoBps: 0,
    },
    {
      id: generarIdUnico(),
      descripcion: 'Diseño UI/UX de Tienda Online (Figma, Design Tokens y Prototipo)',
      cantidad: 1,
      montoUnitario: 280000, // 2.800,00 €
      tasaImpuestoBps: 2100, // 21% IVA España
      tasaDescuentoBps: 500, // 5% Descuento
    },
  ],
  pago: {
    numeroDocumento: 'COT-2026-014',
    fechaEmision: obtenerFechaActualIso(),
    fechaVencimiento: obtenerFechaVencimientoIso(20),
    metodoPago: 'Transferencia SEPA / Stripe Invoice',
    cuentaBancaria: 'Banco Santander • IBAN: ES91 0049 1500 0512 3456 7890',
    notas: 'Cotización sujeta a aprobación formal mediante firma digital del contrato adjunto.',
    terminosCondiciones: 'Validez de la oferta: 20 días calendario. Condiciones de pago: 50% al inicio y 50% contra entrega final de entregables vectoriales.',
  },
};

