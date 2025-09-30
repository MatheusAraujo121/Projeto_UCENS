import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Associate } from './associate.interface';

@Injectable({
  providedIn: 'root'
})
export class AssociateService {

  private apiUrl = '/api/Associado'; 

  constructor(private http: HttpClient) { }

  getAssociados(): Observable<Associate[]> {
    return this.http.get<Associate[]>(this.apiUrl);
  }

  getAssociado(id: number): Observable<Associate> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Associate>(url);
  }

  getAssociadoIds(): Observable<number[]> {
    return this.getAssociados().pipe(
      map(associados => associados.map(a => a.id))
    );
  }

  createAssociate(associateData: Partial<Associate>): Observable<Associate> {
    return this.http.post<Associate>(this.apiUrl, associateData);
  }

  updateAssociate(id: number, associate: Associate): Observable<Associate> {
    return this.http.put<Associate>(`${this.apiUrl}/${id}`, associate);
  }

  deleteAssociado(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}