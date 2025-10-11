// src/app/services/financial/financial.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Boleto } from './boleto.interface'; // Importe a nova interface

@Injectable({
  providedIn: 'root'
})
export class FinancialService {
  private apiUrl = '/api/Financeiro';

  constructor(private http: HttpClient) { }

  gerarRemessa(data: { associadoId: number, valor: number, dataVencimento: string }[]): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/gerar-remessa`, data, {
      responseType: 'blob'
    });
  }

  getBoletos(): Observable<Boleto[]> {
    return this.http.get<Boleto[]>(`${this.apiUrl}/boletos`);
  }
}