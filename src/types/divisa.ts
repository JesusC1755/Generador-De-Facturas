/**
 * Definiciones y tipos para el manejo multidivisa con precisión financiera.
 * Cumple con el estándar de unidades mínimas (minor currency units).
 */

export type CodigoDivisa = 'USD' | 'EUR' | 'COP' | 'MXN' | 'GBP';

export interface ConfiguracionDivisa {
  codigo: CodigoDivisa;
  nombre: string;
  simbolo: string;
  /**
   * Factor multiplicador para convertir la unidad mayor a su mínima expresión entera.
   * Ej: USD = 100 (centavos), COP = 1 (pesos enteros en uso comercial).
   */
  factorUnidadMinima: number;
  /**
   * Número de decimales para presentación en inputs y formato visual.
   */
  decimales: number;
  /**
   * Configuración regional (locale) para Intl.NumberFormat.
   */
  localizacion: string;
}

export const DIVISAS_SOPORTADAS: Record<CodigoDivisa, ConfiguracionDivisa> = {
  USD: {
    codigo: 'USD',
    nombre: 'Dólar Estadounidense',
    simbolo: '$',
    factorUnidadMinima: 100,
    decimales: 2,
    localizacion: 'en-US',
  },
  EUR: {
    codigo: 'EUR',
    nombre: 'Euro',
    simbolo: '€',
    factorUnidadMinima: 100,
    decimales: 2,
    localizacion: 'es-ES',
  },
  COP: {
    codigo: 'COP',
    nombre: 'Peso Colombiano',
    simbolo: '$',
    factorUnidadMinima: 1, // En facturación comercial COP opera en enteros
    decimales: 0,
    localizacion: 'es-CO',
  },
  MXN: {
    codigo: 'MXN',
    nombre: 'Peso Mexicano',
    simbolo: '$',
    factorUnidadMinima: 100,
    decimales: 2,
    localizacion: 'es-MX',
  },
  GBP: {
    codigo: 'GBP',
    nombre: 'Libra Esterlina',
    simbolo: '£',
    factorUnidadMinima: 100,
    decimales: 2,
    localizacion: 'en-GB',
  },
};

