import React, { useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DatosFactura } from '../../types/factura';
import { EntradaTexto } from '../ui/EntradaTexto';
import { EntradaAutocompletado } from '../ui/EntradaAutocompletado';
import { EntradaTelefono } from '../ui/EntradaTelefono';
import { Boton } from '../ui/Boton';
import { procesarArchivoLogo } from '../../utils/archivo';
import { LISTA_PAISES, obtenerCiudadesDePais } from '../../utils/paises';
import { UploadCloud, X, Building2, AlertCircle } from 'lucide-react';

interface PropiedadesSeccionEmisor {
  formulario: UseFormReturn<DatosFactura>;
}

export const SeccionEmisor: React.FC<PropiedadesSeccionEmisor> = ({ formulario }) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = formulario;

  const logoUrl = watch('emisor.logoUrl');
  const paisActual = watch('emisor.pais') || '';
  const ciudadActual = watch('emisor.ciudad') || '';
  const telefonoActual = watch('emisor.telefono') || '';

  const [errorLogo, setErrorLogo] = useState<string | null>(null);
  const inputArchivoRef = useRef<HTMLInputElement>(null);

  // Opciones de países para el autocompletado
  const opcionesPaises = LISTA_PAISES.map((p) => ({
    valor: p.nombre,
    etiqueta: p.nombre,
    icono: p.bandera,
    subtitulo: p.prefijo,
  }));

  // Ciudades sugeridas dinámicas basadas en el país seleccionado
  const ciudadesSugeridas = obtenerCiudadesDePais(paisActual);

  const manejarSubidaLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setErrorLogo(null);
    const resultado = await procesarArchivoLogo(archivo);

    if (resultado.exito && resultado.dataUrl) {
      setValue('emisor.logoUrl', resultado.dataUrl, { shouldDirty: true });
    } else if (resultado.error) {
      setErrorLogo(resultado.error);
    }

    if (inputArchivoRef.current) {
      inputArchivoRef.current.value = '';
    }
  };

  const eliminarLogo = () => {
    setValue('emisor.logoUrl', undefined, { shouldDirty: true });
    setErrorLogo(null);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Building2 className="h-5 w-5 text-blue-600" />
        <h3 className="text-base font-semibold text-slate-800">
          Datos del Emisor (Tu Empresa)
        </h3>
      </div>

      {/* Zona de Carga de Logo */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          Logo Corporativo (Máx 1.5 MB)
        </label>

        {logoUrl ? (
          <div className="relative inline-flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-2.5">
            <img
              src={logoUrl}
              alt="Logo Corporativo"
              className="h-12 w-auto max-w-[160px] object-contain rounded"
            />
            <Boton
              type="button"
              variante="destructivo"
              tamano="sm"
              onClick={eliminarLogo}
              title="Eliminar Logo"
            >
              <X className="h-3.5 w-3.5" />
              Eliminar
            </Boton>
          </div>
        ) : (
          <div>
            <input
              type="file"
              ref={inputArchivoRef}
              onChange={manejarSubidaLogo}
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              id="input-logo"
            />
            <label
              htmlFor="input-logo"
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/50 p-4 transition-colors hover:border-blue-400 hover:bg-blue-50/30"
            >
              <UploadCloud className="h-7 w-7 text-slate-400" />
              <span className="mt-1 text-xs font-medium text-slate-700">
                Haz clic para cargar el logo
              </span>
              <span className="text-[10px] text-slate-400">PNG, JPG, WebP o SVG</span>
            </label>
          </div>
        )}

        {errorLogo && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{errorLogo}</span>
          </div>
        )}
      </div>

      {/* Campos de texto del Emisor */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <EntradaTexto
          etiqueta="Nombre o Razón Social"
          placeholder="Ej: Acme Corp S.A.S"
          error={errors.emisor?.nombre?.message}
          {...register('emisor.nombre')}
        />
        <EntradaTexto
          etiqueta="Identificación Fiscal (NIT / CIF / RFC)"
          placeholder="Ej: NIT 900.123.456-7"
          error={errors.emisor?.identificacionFiscal?.message}
          {...register('emisor.identificacionFiscal')}
        />
        <EntradaTexto
          etiqueta="Correo Electrónico"
          type="email"
          placeholder="facturacion@empresa.com"
          error={errors.emisor?.correo?.message}
          {...register('emisor.correo')}
        />
        {/* Selector de teléfono con prefijo internacional */}
        <EntradaTelefono
          etiqueta="Teléfono de Contacto"
          valor={telefonoActual}
          alCambiar={(val) => setValue('emisor.telefono', val, { shouldDirty: true })}
          paisSugerido={paisActual}
          placeholder="300 123 4567"
        />
        <div className="sm:col-span-2">
          <EntradaTexto
            etiqueta="Dirección Comercial"
            placeholder="Calle 100 # 15-20, Oficina 402"
            {...register('emisor.direccion')}
          />
        </div>
        {/* Selector de Ciudad con autocompletado y sugerencias */}
        <EntradaAutocompletado
          etiqueta="Ciudad"
          valor={ciudadActual}
          alCambiar={(val) => setValue('emisor.ciudad', val, { shouldDirty: true })}
          opciones={ciudadesSugeridas}
          placeholder="Buscar o escribir ciudad..."
        />
        {/* Selector de País con autocompletado y banderas */}
        <EntradaAutocompletado
          etiqueta="País"
          valor={paisActual}
          alCambiar={(val) => {
            setValue('emisor.pais', val, { shouldDirty: true });
          }}
          opciones={opcionesPaises}
          placeholder="Buscar o seleccionar país..."
        />
      </div>
    </div>
  );
};

