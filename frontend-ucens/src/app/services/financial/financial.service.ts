import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialService {
  private apiUrl = '/api/financeiro'; 

  constructor(private http: HttpClient) { }

  gerarRemessa(data: { associadoIds: number[], valor: number, dataVencimento: string }): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/gerar-remessa`, data, {
      responseType: 'blob'
    });
  }
}