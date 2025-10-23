import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RelatorioAssociado, RelatorioFinanceiro, TransacaoManual } from './reports.interface';
@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private relatorioApiUrl = '/api/Relatorio';
  private transacaoApiUrl = '/api/Transacao';

  constructor(private http: HttpClient) { }

  getRelatorioAssociados(): Observable<RelatorioAssociado[]> {
    return this.http.get<RelatorioAssociado[]>(`${this.relatorioApiUrl}/associados-dependentes`);
  }

  getRelatorioFinanceiro(dataInicio: Date, dataFim: Date): Observable<RelatorioFinanceiro> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio.toISOString())
      .set('dataFim', dataFim.toISOString());
    return this.http.get<RelatorioFinanceiro>(`${this.relatorioApiUrl}/fluxo-de-caixa`, { params });
  }

  addTransacaoManual(transacao: TransacaoManual): Observable<any> {
    return this.http.post(this.transacaoApiUrl, transacao);
  }
}