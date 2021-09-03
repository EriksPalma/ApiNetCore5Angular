import { ProductoEstado } from './productoEstado';
export interface Producto {
  id?: number;
  nombre?: string;
  codigo?: number;
  productoEstados?: ProductoEstado[];
}
