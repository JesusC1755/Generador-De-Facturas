import { DatosFactura } from '../types/factura';

/**
 * Límite estricto de tamaño para el logo (800 KB).
 * Protege la cuota máxima de ~5MB de LocalStorage contra QuotaExceededError.
 */
export const LIMITE_LOGO_BYTES = 800 * 1024; // 819,200 bytes

const TIPOS_IMAGEN_PERMITIDOS = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
];

/**
 * Valida y transforma un archivo de imagen en una cadena Base64 (Data URL).
 * Ejecutado 100% en cliente sin requerir servidores ni buckets S3.
 *
 * @param archivo Archivo proveniente de un input file o dropzone
 * @returns Promesa con la cadena Base64 o el mensaje de error de validación
 */
export function procesarArchivoLogo(
  archivo: File
): Promise<{ exito: boolean; dataUrl?: string; error?: string }> {
  return new Promise((resolve) => {
    if (!TIPOS_IMAGEN_PERMITIDOS.includes(archivo.type)) {
      resolve({
        exito: false,
        error: 'Formato inválido. Solo se admiten imágenes PNG, JPEG, WebP o SVG.',
      });
      return;
    }

    if (archivo.size > LIMITE_LOGO_BYTES) {
      const tamanoKb = (archivo.size / 1024).toFixed(1);
      resolve({
        exito: false,
        error: `El archivo supera el límite de 800 KB (${tamanoKb} KB). Reduce su tamaño para proteger el almacenamiento local.`,
      });
      return;
    }

    const lector = new FileReader();

    lector.onload = (evento) => {
      const resultado = evento.target?.result;
      if (typeof resultado === 'string') {
        resolve({ exito: true, dataUrl: resultado });
      } else {
        resolve({ exito: false, error: 'No se pudo leer el archivo de imagen.' });
      }
    };

    lector.onerror = () => {
      resolve({ exito: false, error: 'Ocurrió un error al procesar el archivo.' });
    };

    lector.readAsDataURL(archivo);
  });
}

/**
 * Exporta el estado crudo de la factura como archivo JSON descargable.
 * Garantiza la liberación inmediata de memoria con URL.revokeObjectURL().
 *
 * @param datos Estado crudo de la factura
 * @param nombreArchivo Nombre opcional del archivo a descargar
 */
export function descargarJsonFactura(
  datos: DatosFactura,
  nombreArchivo?: string
): void {
  const contenido = JSON.stringify(datos, null, 2);
  const blob = new Blob([contenido], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const nombreFinal =
    nombreArchivo ||
    `factura_${datos.pago.numeroDocumento || 'borrador'}_${datos.pago.fechaEmision || 'fecha'}.json`;

  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreFinal.replace(/[^a-zA-Z0-9._-]/g, '_');
  document.body.appendChild(enlace);
  enlace.click();

  // Limpieza rigurosa de memoria en el ciclo siguiente
  setTimeout(() => {
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Lee el contenido textual de un archivo JSON subido por el usuario.
 *
 * @param archivo Archivo JSON
 * @returns Promesa con el texto crudo del archivo
 */
export function leerArchivoComoTexto(archivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = (evento) => {
      const texto = evento.target?.result;
      if (typeof texto === 'string') {
        resolve(texto);
      } else {
        reject(new Error('No se pudo leer el archivo como texto'));
      }
    };
    lector.onerror = () => reject(new Error('Error de lectura en el archivo JSON'));
    lector.readAsText(archivo, 'utf-8');
  });
}

