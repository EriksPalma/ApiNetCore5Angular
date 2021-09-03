import { ProductoEstado } from './productoEstado';
export interface Estado {
  id?: number;
  nombre?: string;
  codigo?: number;
  productoEstados?: ProductoEstado[];
}
