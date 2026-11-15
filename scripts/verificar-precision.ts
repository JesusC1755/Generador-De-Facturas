import {
  convertirACentavos,
  convertirDesdeCentavos,
  calcularTotalesFactura,
  formatearMoneda,
} from '../src/utils/moneda';
import { reajustarMontosPorCambioDivisa } from '../src/utils/conversionDivisa';
import { ItemFactura } from '../src/types/factura';

function asegurar(condicion: boolean, mensaje: string) {
  if (!condicion) {
    console.error(`❌ FALLÓ: ${mensaje}`);
    process.exit(1);
  }
  console.log(`✅ PASÓ: ${mensaje}`);
}

console.log('--- TEST 1: Precisión IEEE 754 en Conversión ---');
asegurar(convertirACentavos('19.99', 100) === 1999, '"19.99" USD debe ser exactamente 1999 centavos');
asegurar(convertirACentavos('0.10', 100) + convertirACentavos('0.20', 100) === 30, '0.10 + 0.20 debe ser exactamente 30 centavos (no 0.30000000000000004)');
asegurar(convertirDesdeCentavos(1999, 100, 2) === '19.99', '1999 centavos debe volver a "19.99"');

console.log('\n--- TEST 2: Manejo de Divisas Zero-Decimal (COP) ---');
asegurar(convertirACentavos('150000', 1) === 150000, '"150000" COP debe ser 150000');
asegurar(convertirDesdeCentavos(150000, 1, 0) === '150000', '150000 COP debe formatearse sin decimales');

console.log('\n--- TEST 3: Determinismo Contable y Puntos Básicos (BPS) ---');
const itemsPrueba: ItemFactura[] = [
  {
    id: '1',
    descripcion: 'Servicio Cloud',
    cantidad: 1,
    montoUnitario: 10000, // $100.00
    tasaImpuestoBps: 1900, // 19%
    tasaDescuentoBps: 500,  // 5% -> Descuento: $5.00 (500 centavos)
  },
  {
    id: '2',
    descripcion: 'Consultoría',
    cantidad: 2,
    montoUnitario: 5000, // $50.00 x 2 = $100.00
    tasaImpuestoBps: 1900, // 19%
    tasaDescuentoBps: 0,
  },
];

const resultado = calcularTotalesFactura(itemsPrueba);

// Item 1: Bruto 10000, Descuento 500, Base 9500, Impuesto Math.round(9500 * 1900 / 10000) = 1805, Total 11305
// Item 2: Bruto 10000, Descuento 0, Base 10000, Impuesto Math.round(10000 * 1900 / 10000) = 1900, Total 11900
// Subtotal Bruto: 20000 ($200.00)
// Total Descuentos: 500 ($5.00)
// Base Gravable: 19500 ($195.00)
// Total Impuestos: 3705 ($37.05)
// Total a Pagar: 19500 + 3705 = 23205 ($232.05)

asegurar(resultado.subtotalBruto === 20000, 'Subtotal bruto debe ser 20000 centavos');
asegurar(resultado.totalDescuentos === 500, 'Descuentos totales deben ser 500 centavos');
asegurar(resultado.baseGravableTotal === 19500, 'Base gravable debe ser 19500 centavos');
asegurar(resultado.totalImpuestos === 3705, 'Total impuestos debe ser 3705 centavos');
asegurar(resultado.totalPagar === 23205, 'Total a pagar debe ser 23205 centavos');

console.log('\n--- TEST 4: Formato de Moneda Internacional ---');
const formatoUsd = formatearMoneda(23205, 'USD');
const formatoCop = formatearMoneda(150000, 'COP');
console.log(`USD Formateado: ${formatoUsd}`);
console.log(`COP Formateado: ${formatoCop}`);
asegurar(formatoUsd.includes('232.05') || formatoUsd.includes('232,05'), 'Formato USD debe contener 232.05');

console.log('\n--- TEST 5: Re-escalado Seguro USD <-> COP ---');
const itemsUsd: ItemFactura[] = [
  {
    id: '1',
    descripcion: 'Consultoría',
    cantidad: 1,
    montoUnitario: 5000, // $50.00 USD (factor 100)
    tasaImpuestoBps: 1900,
    tasaDescuentoBps: 0,
  },
];
const itemsCop = reajustarMontosPorCambioDivisa(itemsUsd, 'USD', 'COP');
asegurar(itemsCop[0]?.montoUnitario === 50, 'Al pasar $50.00 USD a COP debe resultar 50 COP (no 5000)');

const itemsVueltaUsd = reajustarMontosPorCambioDivisa(itemsCop, 'COP', 'USD');
asegurar(itemsVueltaUsd[0]?.montoUnitario === 5000, 'Al regresar de 50 COP a USD debe volver a 5000 centavos');

console.log('\n✨ ¡TODAS LAS PRUEBAS DE PRECISIÓN FINANCIERA PASARON CON ÉXITO! ✨');
