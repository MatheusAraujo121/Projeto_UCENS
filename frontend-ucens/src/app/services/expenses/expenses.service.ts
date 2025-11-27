

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Despesa } from './expenses.interface';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  private apiUrl = `${environment.apiUrl}/api/Fornecedor`;

  constructor(private http: HttpClient) { }

  getExpensesByFornecedor(fornecedorId: number): Observable<Despesa[]> {
    return this.http.get<Despesa[]>(`${this.apiUrl}/${fornecedorId}/despesas`);
  }

  getExpenseById(id: number): Observable<Despesa> {
    return this.http.get<Despesa>(`${this.apiUrl}/despesas/${id}`);
  }

  createExpense(despesa: Despesa): Observable<Despesa> {
    return this.http.post<Despesa>(`${this.apiUrl}/${despesa.fornecedorId}/despesas`, despesa);
  }


  updateExpense(id: number, despesa: Despesa): Observable<Despesa> {
    return this.http.put<Despesa>(`${this.apiUrl}/despesas/${id}`, despesa);
  }


  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/despesas/${id}`);
  }
}