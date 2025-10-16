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

  solicitarCancelamento(id: number, motivo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/solicitar-cancelamento/${id}`, { motivo });
  }

  // NOVO MÉTODO PARA IMPORTAR ARQUIVO DE RETORNO
  importarRetorno(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.apiUrl}/importar-retorno`, formData, { responseType: 'text' });
  }

  getHistorico(associadoId: number): Observable<Boleto[]> {
    return this.http.get<Boleto[]>(`${this.apiUrl}/historico/${associadoId}`);
  }

  getBoletoById(id: number): Observable<Boleto> {
    return this.http.get<Boleto>(`${this.apiUrl}/boleto/${id}`);
  }
}