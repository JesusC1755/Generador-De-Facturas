/**
 * Dataset centralizado y liviano de países, prefijos telefónicos y ciudades principales.
 * Cumple con el estándar Local-First: cero dependencias pesadas (~25 KB en memoria).
 */

export interface InfoPais {
  codigo: string; // ISO 3166-1 alpha-2
  nombre: string;
  bandera: string; // Emoji de bandera
  prefijo: string; // E.164 (ej. +57)
  ciudades: string[];
}

export const LISTA_PAISES: InfoPais[] = [
  // Iberoamérica y Norteamérica
  {
    codigo: 'CO',
    nombre: 'Colombia',
    bandera: '🇨🇴',
    prefijo: '+57',
    ciudades: [
      'Bogotá D.C.',
      'Medellín',
      'Cali',
      'Barranquilla',
      'Cartagena',
      'Bucaramanga',
      'Pereira',
      'Manizales',
      'Santa Marta',
      'Cúcuta',
      'Ibagué',
      'Villavicencio',
      'Pasto',
      'Chía',
      'Envigado',
      'Rionegro',
    ],
  },
  {
    codigo: 'ES',
    nombre: 'España',
    bandera: '🇪🇸',
    prefijo: '+34',
    ciudades: [
      'Madrid',
      'Barcelona',
      'Valencia',
      'Sevilla',
      'Zaragoza',
      'Málaga',
      'Murcia',
      'Palma de Mallorca',
      'Las Palmas',
      'Bilbao',
      'Alicante',
      'Córdoba',
      'Valladolid',
      'Vigo',
      'Gijón',
    ],
  },
  {
    codigo: 'US',
    nombre: 'Estados Unidos',
    bandera: '🇺🇸',
    prefijo: '+1',
    ciudades: [
      'New York, NY',
      'Los Angeles, CA',
      'Chicago, IL',
      'Houston, TX',
      'Phoenix, AZ',
      'Philadelphia, PA',
      'San Antonio, TX',
      'San Diego, CA',
      'Dallas, TX',
      'San Francisco, CA',
      'Austin, TX',
      'Miami, FL',
      'Seattle, WA',
      'Boston, MA',
    ],
  },
  {
    codigo: 'MX',
    nombre: 'México',
    bandera: '🇲🇽',
    prefijo: '+52',
    ciudades: [
      'Ciudad de México',
      'Guadalajara',
      'Monterrey',
      'Puebla',
      'Tijuana',
      'León',
      'Querétaro',
      'Ciudad Juárez',
      'Mérida',
      'Cancún',
      'San Luis Potosí',
      'Aguascalientes',
      'Hermosillo',
      'Saltillo',
    ],
  },
  {
    codigo: 'AR',
    nombre: 'Argentina',
    bandera: '🇦🇷',
    prefijo: '+54',
    ciudades: [
      'Buenos Aires',
      'Córdoba',
      'Rosario',
      'Mendoza',
      'La Plata',
      'San Miguel de Tucumán',
      'Mar del Plata',
      'Salta',
      'Santa Fe',
      'San Juan',
      'Neuquén',
    ],
  },
  {
    codigo: 'CL',
    nombre: 'Chile',
    bandera: '🇨🇱',
    prefijo: '+56',
    ciudades: [
      'Santiago',
      'Valparaíso',
      'Concepción',
      'La Serena',
      'Antofagasta',
      'Temuco',
      'Rancagua',
      'Talca',
      'Arica',
      'Puerto Montt',
      'Iquique',
      'Viña del Mar',
    ],
  },
  {
    codigo: 'PE',
    nombre: 'Perú',
    bandera: '🇵🇪',
    prefijo: '+51',
    ciudades: [
      'Lima',
      'Arequipa',
      'Trujillo',
      'Chiclayo',
      'Piura',
      'Cusco',
      'Huancayo',
      'Iquitos',
      'Tacna',
      'Pucallpa',
    ],
  },
  {
    codigo: 'EC',
    nombre: 'Ecuador',
    bandera: '🇪🇨',
    prefijo: '+593',
    ciudades: [
      'Quito',
      'Guayaquil',
      'Cuenca',
      'Santo Domingo',
      'Machala',
      'Manta',
      'Portoviejo',
      'Ambato',
      'Loja',
    ],
  },
  {
    codigo: 'PA',
    nombre: 'Panamá',
    bandera: '🇵🇦',
    prefijo: '+507',
    ciudades: [
      'Ciudad de Panamá',
      'San Miguelito',
      'Colón',
      'David',
      'La Chorrera',
      'Santiago de Veraguas',
    ],
  },
  {
    codigo: 'CR',
    nombre: 'Costa Rica',
    bandera: '🇨🇷',
    prefijo: '+506',
    ciudades: [
      'San José',
      'Alajuela',
      'Cartago',
      'Heredia',
      'Puntarenas',
      'Limón',
      'Liberia',
    ],
  },
  {
    codigo: 'DO',
    nombre: 'República Dominicana',
    bandera: '🇩🇴',
    prefijo: '+1-809',
    ciudades: [
      'Santo Domingo',
      'Santiago de los Caballeros',
      'Santo Domingo Este',
      'San Pedro de Macorís',
      'La Romana',
      'Punta Cana',
    ],
  },
  {
    codigo: 'UY',
    nombre: 'Uruguay',
    bandera: '🇺🇾',
    prefijo: '+598',
    ciudades: ['Montevideo', 'Salto', 'Ciudad de la Costa', 'Paysandú', 'Maldonado', 'Punta del Este'],
  },
  {
    codigo: 'PY',
    nombre: 'Paraguay',
    bandera: '🇵🇾',
    prefijo: '+595',
    ciudades: ['Asunción', 'Ciudad del Este', 'San Lorenzo', 'Luque', 'Capiatá', 'Encarnación'],
  },
  {
    codigo: 'BO',
    nombre: 'Bolivia',
    bandera: '🇧🇴',
    prefijo: '+591',
    ciudades: ['La Paz', 'Santa Cruz de la Sierra', 'Cochabamba', 'Sucre', 'Oruro', 'Tarija'],
  },
  {
    codigo: 'GT',
    nombre: 'Guatemala',
    bandera: '🇬🇹',
    prefijo: '+502',
    ciudades: ['Ciudad de Guatemala', 'Mixco', 'Villa Nueva', 'Quetzaltenango', 'Antigua Guatemala'],
  },
  {
    codigo: 'BR',
    nombre: 'Brasil',
    bandera: '🇧🇷',
    prefijo: '+55',
    ciudades: [
      'São Paulo',
      'Rio de Janeiro',
      'Brasília',
      'Salvador',
      'Fortaleza',
      'Belo Horizonte',
      'Curitiba',
      'Porto Alegre',
    ],
  },
  {
    codigo: 'CA',
    nombre: 'Canadá',
    bandera: '🇨🇦',
    prefijo: '+1',
    ciudades: ['Toronto, ON', 'Montreal, QC', 'Vancouver, BC', 'Calgary, AB', 'Ottawa, ON', 'Edmonton, AB'],
  },

  // Europa y Resto del Mundo
  {
    codigo: 'GB',
    nombre: 'Reino Unido',
    bandera: '🇬🇧',
    prefijo: '+44',
    ciudades: ['Londres', 'Manchester', 'Birmingham', 'Edimburgo', 'Glasgow', 'Liverpool', 'Bristol'],
  },
  {
    codigo: 'DE',
    nombre: 'Alemania',
    bandera: '🇩🇪',
    prefijo: '+49',
    ciudades: ['Berlín', 'Múnich', 'Fráncfort', 'Hamburgo', 'Colonia', 'Stuttgart', 'Düsseldorf'],
  },
  {
    codigo: 'FR',
    nombre: 'Francia',
    bandera: '🇫🇷',
    prefijo: '+33',
    ciudades: ['París', 'Marsella', 'Lyon', 'Toulouse', 'Niza', 'Nantes', 'Estrasburgo', 'Burdeos'],
  },
  {
    codigo: 'IT',
    nombre: 'Italia',
    bandera: '🇮🇹',
    prefijo: '+39',
    ciudades: ['Roma', 'Milán', 'Nápoles', 'Turín', 'Palermo', 'Florencia', 'Bolonia', 'Venecia'],
  },
  {
    codigo: 'PT',
    nombre: 'Portugal',
    bandera: '🇵🇹',
    prefijo: '+351',
    ciudades: ['Lisboa', 'Oporto', 'Vila Nova de Gaia', 'Amadora', 'Braga', 'Coímbra', 'Funchal'],
  },
  {
    codigo: 'NL',
    nombre: 'Países Bajos',
    bandera: '🇳🇱',
    prefijo: '+31',
    ciudades: ['Ámsterdam', 'Róterdam', 'La Haya', 'Utrecht', 'Eindhoven'],
  },
  {
    codigo: 'CH',
    nombre: 'Suiza',
    bandera: '🇨🇭',
    prefijo: '+41',
    ciudades: ['Zúrich', 'Ginebra', 'Basilea', 'Lausana', 'Berna'],
  },
  {
    codigo: 'SE',
    nombre: 'Suecia',
    bandera: '🇸🇪',
    prefijo: '+46',
    ciudades: ['Estocolmo', 'Gotemburgo', 'Malmö', 'Upsala'],
  },
  {
    codigo: 'JP',
    nombre: 'Japón',
    bandera: '🇯🇵',
    prefijo: '+81',
    ciudades: ['Tokio', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Kioto'],
  },
  {
    codigo: 'AU',
    nombre: 'Australia',
    bandera: '🇦🇺',
    prefijo: '+61',
    ciudades: ['Sídney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaida'],
  },
];

/**
 * Normaliza cadenas quitando acentos y mayúsculas para búsquedas insensibles.
 */
export function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Busca un país por coincidencia en su nombre, código ISO o prefijo.
 */
export function buscarPais(termino: string): InfoPais | undefined {
  if (!termino) return undefined;
  const limpio = normalizarTexto(termino);

  return LISTA_PAISES.find(
    (p) =>
      normalizarTexto(p.nombre) === limpio ||
      p.codigo.toLowerCase() === limpio ||
      p.prefijo.replace('+', '') === limpio.replace('+', '')
  );
}

/**
 * Obtiene las ciudades sugeridas para un país dado.
 */
export function obtenerCiudadesDePais(nombreOPais: string): string[] {
  const pais = buscarPais(nombreOPais);
  return pais ? pais.ciudades : [];
}

