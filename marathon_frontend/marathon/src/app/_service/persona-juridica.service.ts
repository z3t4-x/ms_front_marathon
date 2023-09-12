import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonaJuridicaService {


  private apiUrl = `${environment.HOST}/api`;

  constructor(private http: HttpClient) {}

  registrarPersonaJuridica(RequestPersonaJur: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<any>(`${this.apiUrl}/registrar`, RequestPersonaJur, { headers })
      .pipe(catchError(this.handleError));
  }

  listarPersonasJuridicas(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/listar`)
      .pipe(catchError(this.handleError));
  }



  obtenerInformacionPersonaJuridica(ruc: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${ruc}`)
      .pipe(catchError(this.handleError));
  }

  
  private handleError(error: any) {
    console.error('Error:', error);
    return throwError(error);
  }

}