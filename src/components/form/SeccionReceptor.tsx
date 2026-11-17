import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { DatosFactura } from '../../types/factura';
import { EntradaTexto } from '../ui/EntradaTexto';
import { EntradaAutocompletado } from '../ui/EntradaAutocompletado';
import { EntradaTelefono } from '../ui/EntradaTelefono';
import { LISTA_PAISES, obtenerCiudadesDePais } from '../../utils/paises';
import { UserCheck } from 'lucide-react';

interface PropiedadesSeccionReceptor {
  formulario: UseFormReturn<DatosFactura>;
}

export const SeccionReceptor: React.FC<PropiedadesSeccionReceptor> = ({ formulario }) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = formulario;

  const paisActual = watch('receptor.pais') || '';
  const ciudadActual = watch('receptor.ciudad') || '';
  const telefonoActual = watch('receptor.telefono') || '';

  // Opciones de países para el autocompletado
  const opcionesPaises = LISTA_PAISES.map((p) => ({
    valor: p.nombre,
    etiqueta: p.nombre,
    icono: p.bandera,
    subtitulo: p.prefijo,
  }));

  // Ciudades sugeridas dinámicas basadas en el país seleccionado
  const ciudadesSugeridas = obtenerCiudadesDePais(paisActual);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <UserCheck className="h-5 w-5 text-indigo-600" />
        <h3 className="text-base font-semibold text-slate-800">
          Datos del Receptor (Cliente)
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <EntradaTexto
          etiqueta="Nombre del Cliente o Empresa"
          placeholder="Ej: Innova Tech Ltd."
          error={errors.receptor?.nombre?.message}
          {...register('receptor.nombre')}
        />
        <EntradaTexto
          etiqueta="Identificación Fiscal del Cliente"
          placeholder="Ej: NIT / CIF / NIF"
          error={errors.receptor?.identificacionFiscal?.message}
          {...register('receptor.identificacionFiscal')}
        />
        <EntradaTexto
          etiqueta="Correo Electrónico del Cliente"
          type="email"
          placeholder="pagos@clientefinal.com"
          error={errors.receptor?.correo?.message}
          {...register('receptor.correo')}
        />
        {/* Selector de teléfono con prefijo internacional */}
        <EntradaTelefono
          etiqueta="Teléfono"
          valor={telefonoActual}
          alCambiar={(val) => setValue('receptor.telefono', val, { shouldDirty: true })}
          paisSugerido={paisActual}
          placeholder="555 000 0000"
        />
        <div className="sm:col-span-2">
          <EntradaTexto
            etiqueta="Dirección"
            placeholder="Dirección fiscal o de entrega"
            {...register('receptor.direccion')}
          />
        </div>
        {/* Selector de Ciudad con autocompletado y sugerencias */}
        <EntradaAutocompletado
          etiqueta="Ciudad"
          valor={ciudadActual}
          alCambiar={(val) => setValue('receptor.ciudad', val, { shouldDirty: true })}
          opciones={ciudadesSugeridas}
          placeholder="Buscar o escribir ciudad..."
        />
        {/* Selector de País con autocompletado y banderas */}
        <EntradaAutocompletado
          etiqueta="País"
          valor={paisActual}
          alCambiar={(val) => {
            setValue('receptor.pais', val, { shouldDirty: true });
          }}
          opciones={opcionesPaises}
          placeholder="Buscar o seleccionar país..."
        />
      </div>
    </div>
  );
};

