import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Fornecedor, Despesa } from './supplier.interface';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = `${environment.apiUrl}/api/Fornecedor`;

  constructor(private http: HttpClient) { }

  // Fornecedor Methods
  getSuppliers(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(this.apiUrl);
  }

  getSupplierById(id: number): Observable<Fornecedor> {
    return this.http.get<Fornecedor>(`${this.apiUrl}/${id}`);
  }
  getSupplierIds(): Observable<number[]> {
    return this.getSuppliers().pipe(
      map(suppliers => suppliers.map(s => s.id))
    );
  }

  createSupplier(supplier: Omit<Fornecedor, 'id' | 'despesas'>): Observable<Fornecedor> {
    return this.http.post<Fornecedor>(this.apiUrl, supplier);
  }

  updateSupplier(id: number, supplier: Fornecedor): Observable<Fornecedor> {
    return this.http.put<Fornecedor>(`${this.apiUrl}/${id}`, supplier);
  }

  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Despesa Methods
  addDespesa(fornecedorId: number, despesa: Omit<Despesa, 'id'>): Observable<Despesa> {
    return this.http.post<Despesa>(`${this.apiUrl}/${fornecedorId}/despesas`, despesa);
  }

  updateDespesa(id: number, despesa: Despesa): Observable<Despesa> {
    return this.http.put<Despesa>(`${this.apiUrl}/despesas/${id}`, despesa);
  }

  deleteDespesa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/despesas/${id}`);
  }
}