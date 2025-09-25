import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contato } from './contact.interface';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = '/api/Contato';

  constructor(private http: HttpClient) { }

  enviarMensagem(contato: Contato): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/enviar`, contato);
  }
}