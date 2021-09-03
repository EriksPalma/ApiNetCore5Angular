import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoEstado } from '../interfaces/productoEstado';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductoEstadoService {
  private baseUrl = 'https://localhost:44387/api';

  constructor(private http: HttpClient) {}

  obtenerProductoEstado( estado: string ): Observable<ProductoEstado[]> {

    return this.http.get<ProductoEstado[]>(`${this.baseUrl}/ProductoEstados?estado=${estado}`).pipe(
      map( (resp) => {
        return resp;
      } )
    );
  }

  crear( objeto: ProductoEstado ): Observable<ProductoEstado> {

    return this.http.post<ProductoEstado>(`${ this.baseUrl }/ProductoEstados`, objeto ).pipe(
      map( (resp) => {
        return resp;
      } )
    );
  }

  actualizar( objeto: ProductoEstado ): Observable<object>  {

    return this.http.put(`${this.baseUrl}/ProductoEstados/${objeto.id}`, objeto).pipe(
      map( (resp) => {
        return resp;
      } )
    );
  }

}
