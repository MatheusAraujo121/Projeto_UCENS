import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RelatorioAssociado, RelatorioFinanceiro, TransacaoManual } from './reports.interface';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = environment.apiUrl;

  // 3. MONTE AS URLS COMPLETAS USANDO A URL BASE
  private relatorioApiUrl = `${this.apiUrl}/api/Relatorio`;
  private transacaoApiUrl = `${this.apiUrl}/api/Transacao`;

  constructor(private http: HttpClient) { }

  // --- Relatórios simples (sem datas) ---
  getRelatorioAssociados(): Observable<any> {
    return this.http.get(`${this.relatorioApiUrl}/associados`);
  }

  getRelatorioAssociadosComDependentes(): Observable<RelatorioAssociado[]> {
    return this.http.get<RelatorioAssociado[]>(`${this.relatorioApiUrl}/associados-dependentes`);
  }

  getRelatorioAdimplentes(): Observable<any> {
    return this.http.get(`${this.relatorioApiUrl}/adimplentes`);
  }

  getRelatorioInadimplentes(): Observable<any> {
    return this.http.get(`${this.relatorioApiUrl}/inadimplentes`);
  }

  getRelatorioDependentes(): Observable<any> {
    return this.http.get(`${this.relatorioApiUrl}/dependentes`);
  }

  getRelatorioUsuarios(): Observable<any> {
    return this.http.get(`${this.relatorioApiUrl}/usuarios`);
  }

  getRelatorioFornecedores(): Observable<any> {
    return this.http.get(`${this.relatorioApiUrl}/fornecedores`);
  }

  // --- Relatórios com intervalo de datas ---
  getRelatorioFluxoCaixa(dataInicio: Date, dataFim: Date): Observable<RelatorioFinanceiro> {
    return this.getComDatas(`${this.relatorioApiUrl}/fluxo-caixa`, dataInicio, dataFim);
  }

  getRelatorioContasAReceber(dataInicio: Date, dataFim: Date): Observable<any> {
    return this.getComDatas(`${this.relatorioApiUrl}/contas-a-receber`, dataInicio, dataFim);
  }

  getRelatorioContasAPagar(dataInicio: Date, dataFim: Date): Observable<any> {
    return this.getComDatas(`${this.relatorioApiUrl}/contas-a-pagar`, dataInicio, dataFim);
  }

  getRelatorioContasPagas(dataInicio: Date, dataFim: Date): Observable<any> {
    return this.getComDatas(`${this.relatorioApiUrl}/contas-pagas`, dataInicio, dataFim);
  }

  getRelatorioReceitasArrecadadas(dataInicio: Date, dataFim: Date): Observable<any> {
    return this.getComDatas(`${this.relatorioApiUrl}/receitas-arrecadadas`, dataInicio, dataFim);
  }

  getRelatorioContasRecebidas(dataInicio: Date, dataFim: Date): Observable<any> {
    return this.getComDatas(`${this.relatorioApiUrl}/contas-recebidas`, dataInicio, dataFim);
  }

  getRelatorioExtratoFinanceiro(dataInicio: Date, dataFim: Date): Observable<any> {
    return this.getComDatas(`${this.relatorioApiUrl}/extrato-financeiro`, dataInicio, dataFim);
  }

  getRelatorioArrecadacaoMensalidades(dataInicio: Date, dataFim: Date): Observable<any> {
    return this.getComDatas(`${this.relatorioApiUrl}/arrecadacao-mensalidades`, dataInicio, dataFim);
  }

  getRelatorioDespesasPorEmissao(dataInicio: Date, dataFim: Date): Observable<any> {
    return this.getComDatas(`${this.relatorioApiUrl}/despesas-por-emissao`, dataInicio, dataFim);
  }

  getRelatorioResumoFinanceiro(dataInicio: Date, dataFim: Date): Observable<any> {
    return this.getComDatas(`${this.relatorioApiUrl}/resumo-financeiro`, dataInicio, dataFim);
  }

  getRelatorioPrevisaoFinanceira(dataInicio: Date, dataFim: Date): Observable<any> {
    return this.getComDatas(`${this.relatorioApiUrl}/previsao-financeira`, dataInicio, dataFim);
  }

  // --- Relatórios com parâmetro único ---
  getRelatorioReceitasMensais(ano: number): Observable<any> {
    const params = new HttpParams().set('ano', ano.toString());
    return this.http.get(`${this.relatorioApiUrl}/receitas-mensais`, { params });
  }

  getRelatorioMovimentoDiario(data: Date): Observable<any> {
    const params = new HttpParams().set('data', data.toISOString());
    return this.http.get(`${this.relatorioApiUrl}/movimento-diario`, { params });
  }

  // --- Transações ---
  addTransacaoManual(transacao: TransacaoManual): Observable<any> {
    return this.http.post(this.transacaoApiUrl, transacao);
  }

  // --- Função utilitária privada ---
  private getComDatas(url: string, dataInicio: Date, dataFim: Date): Observable<any> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio.toISOString())
      .set('dataFim', dataFim.toISOString());
    return this.http.get(url, { params });
  }
}
