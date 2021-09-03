import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Producto } from '../interfaces/producto';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductosServiceService {

  private baseUrl = 'https://localhost:44387/api';

  constructor( private http: HttpClient) { }

  obtenerProductos( ): Observable<Producto[]> {

    return this.http.get<Producto[]>(`${ this.baseUrl }/Productos` ).pipe(
      map( (resp) => {
        return resp;
      } )
    );
  }

  crear( objeto: Producto ): Observable<Producto> {

    return this.http.post<Producto>(`${ this.baseUrl }/Productos`, objeto ).pipe(
      map( (resp) => {
        return resp;
      } )
    );
  }
}

