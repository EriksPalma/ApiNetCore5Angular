import { Producto } from './producto';
import { Estado } from './estado';
export interface ProductoEstado {
  id?: number;
  idProducto?: number;
  idEstado?: number;
  cantidad?: number;

  estado?: Estado;
  producto?: Producto;

  idEstadoNavigation?: null;
  idProductoNavigation?: null;
}
