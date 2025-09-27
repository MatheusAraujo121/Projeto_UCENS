import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Associate } from './associate.interface';

// A interface 'Associate' pode ser movida para um arquivo separado (ex: 'associate.model.ts') 
// para ser reutilizada em outros lugares da aplicação.

@Injectable({
  providedIn: 'root'
})
export class AssociateService {

  // IMPORTANTE: Substitua pela URL da sua API real.
  private apiUrl = '/api/Associado'; 

  constructor(private http: HttpClient) { }

  /**
   * Busca a lista de todos os associados.
   */
  getAssociados(): Observable<Associate[]> {
    return this.http.get<Associate[]>(this.apiUrl);
  }

  /**
   * Busca um único associado pelo seu ID.
   */
  getAssociado(id: number): Observable<Associate> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Associate>(url);
  }

  /**
   * Busca todos os IDs dos associados para a navegação de "anterior" e "próximo".
   * O ideal é que seu backend tenha um endpoint otimizado para isso.
   */
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

  /**
   * Exclui um associado pelo seu ID.
   */
  deleteAssociado(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}