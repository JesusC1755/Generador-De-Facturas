import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  ConfiguracionFactura,
  DatosEmisor,
  DatosFactura,
  DatosPago,
  DatosReceptor,
  esquemaFactura,
  ItemFactura,
} from '../types/factura';
import {
  FACTURA_INICIAL,
  crearFacturaInicial,
  generarIdUnico,
} from '../utils/datosIniciales';

interface EstadoAlmacenFactura {
  factura: DatosFactura;
  /**
   * Contador no persistido que solo se incrementa en reemplazos externos
   * (Cargar Ejemplo, Importar JSON, Limpiar/Nuevo) para sincronizar el formulario
   * sin disparar reset() durante el auto-guardado en vivo.
   */
  versionExterna: number;

  // Acciones granulares
  actualizarFactura: (parcial: Partial<DatosFactura>) => void;
  actualizarEmisor: (datos: Partial<DatosEmisor>) => void;
  actualizarReceptor: (datos: Partial<DatosReceptor>) => void;
  actualizarConfiguracion: (datos: Partial<ConfiguracionFactura>) => void;
  actualizarPago: (datos: Partial<DatosPago>) => void;
  actualizarItems: (items: ItemFactura[]) => void;
  agregarItem: (item?: Partial<ItemFactura>) => void;
  actualizarItemPorId: (id: string, item: Partial<ItemFactura>) => void;
  eliminarItem: (id: string) => void;
  reordenarItems: (items: ItemFactura[]) => void;

  // Acciones globales
  restablecerFactura: (datos?: DatosFactura) => void;
  cargarDesdeJson: (jsonString: string) => { exito: boolean; error?: string };
}

export const CLAVE_LOCAL_STORAGE = 'invoicecraft_borrador_v1';

export const usarAlmacenFactura = create<EstadoAlmacenFactura>()(
  persist(
    (set, get) => ({
      factura: FACTURA_INICIAL,
      versionExterna: 0,

      actualizarFactura: (parcial) => {
        set((state) => ({
          factura: { ...state.factura, ...parcial },
        }));
      },

      actualizarEmisor: (datos) => {
        set((state) => ({
          factura: {
            ...state.factura,
            emisor: { ...state.factura.emisor, ...datos },
          },
        }));
      },

      actualizarReceptor: (datos) => {
        set((state) => ({
          factura: {
            ...state.factura,
            receptor: { ...state.factura.receptor, ...datos },
          },
        }));
      },

      actualizarConfiguracion: (datos) => {
        set((state) => ({
          factura: {
            ...state.factura,
            configuracion: { ...state.factura.configuracion, ...datos },
          },
        }));
      },

      actualizarPago: (datos) => {
        set((state) => ({
          factura: {
            ...state.factura,
            pago: { ...state.factura.pago, ...datos },
          },
        }));
      },

      actualizarItems: (items) => {
        set((state) => ({
          factura: {
            ...state.factura,
            items,
          },
        }));
      },

      agregarItem: (itemParcial) => {
        const nuevoItem: ItemFactura = {
          id: generarIdUnico(),
          descripcion: itemParcial?.descripcion ?? 'Nuevo concepto de servicio / producto',
          cantidad: itemParcial?.cantidad ?? 1,
          montoUnitario: itemParcial?.montoUnitario ?? 10000, // $100.00
          tasaImpuestoBps: itemParcial?.tasaImpuestoBps ?? 1900, // 19%
          tasaDescuentoBps: itemParcial?.tasaDescuentoBps ?? 0,
        };

        set((state) => ({
          factura: {
            ...state.factura,
            items: [...state.factura.items, nuevoItem],
          },
        }));
      },

      actualizarItemPorId: (id, itemParcial) => {
        set((state) => ({
          factura: {
            ...state.factura,
            items: state.factura.items.map((item) =>
              item.id === id ? { ...item, ...itemParcial } : item
            ),
          },
        }));
      },

      eliminarItem: (id) => {
        const { items } = get().factura;
        if (items.length <= 1) {
          // Mantener al menos un ítem para cumplir el contrato Zod
          return;
        }

        set((state) => ({
          factura: {
            ...state.factura,
            items: state.factura.items.filter((item) => item.id !== id),
          },
        }));
      },

      reordenarItems: (items) => {
        set((state) => ({
          factura: {
            ...state.factura,
            items,
          },
        }));
      },

      restablecerFactura: (datos) => {
        set((state) => ({
          factura: datos
            ? {
                ...datos,
                id: generarIdUnico(),
                items: datos.items.map((item) => ({ ...item })),
              }
            : crearFacturaInicial(),
          versionExterna: state.versionExterna + 1,
        }));
      },

      cargarDesdeJson: (jsonString: string) => {
        try {
          const parsed = JSON.parse(jsonString);
          const validacion = esquemaFactura.safeParse(parsed);

          if (!validacion.success) {
            const erroresFormateados = validacion.error.errors
              .map((e) => `${e.path.join('.')}: ${e.message}`)
              .join('; ');
            return {
              exito: false,
              error: `El archivo JSON no cumple con el esquema: ${erroresFormateados}`,
            };
          }

          set((state) => ({
            factura: validacion.data,
            versionExterna: state.versionExterna + 1,
          }));
          return { exito: true };
        } catch (error) {
          return {
            exito: false,
            error: error instanceof Error ? error.message : 'Error desconocido al parsear JSON',
          };
        }
      },
    }),
    {
      name: CLAVE_LOCAL_STORAGE,
      storage: createJSONStorage(() => localStorage),
      // Solo persistir la estructura de la factura (datos puros)
      partialize: (state) => ({ factura: state.factura }),
    }
  )
);

