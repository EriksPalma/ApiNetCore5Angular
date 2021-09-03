import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estado } from '../interfaces/estado';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {
  private baseUrl = 'https://localhost:44387/api';

  constructor( private http: HttpClient) { }

  obtenerEstados(): Observable<Estado[]>{

    return this.http.get<Estado[]>(`${ this.baseUrl }/Estados` ).pipe(
      map( (resp) => {
        return resp;
      } )
    );
  }
}
