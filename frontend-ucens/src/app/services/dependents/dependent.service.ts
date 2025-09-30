import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dependent } from './dependent.interface';

@Injectable({
  providedIn: 'root'
})
export class DependentService {
  // Corrigido para "dependentes" no plural, conforme o log de erro.
  private apiUrl = '/api/dependentes';

  constructor(private http: HttpClient) { }

  /**
   * Retorna uma lista com todos os dependentes.
   */
  getDependents(): Observable<Dependent[]> {
    return this.http.get<Dependent[]>(this.apiUrl);
  }

  /**
   * Busca um único dependente pelo seu ID.
   */
  getDependentById(id: number): Observable<Dependent> {
    return this.http.get<Dependent>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cria um novo dependente no backend.
   */
  createDependent(dependentData: Partial<Dependent>): Observable<Dependent> {
    return this.http.post<Dependent>(this.apiUrl, dependentData);
  }

  /**
 * Atualiza os dados de um dependente existente.
 */
  updateDependent(id: number, dependentData: Partial<Dependent>): Observable<Dependent> {
    return this.http.put<Dependent>(`${this.apiUrl}/${id}`, dependentData);
  }


  /**
   * Exclui um dependente pelo seu ID.
   */
  deleteDependent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

