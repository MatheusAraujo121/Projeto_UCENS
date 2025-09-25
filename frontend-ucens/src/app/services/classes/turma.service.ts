import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turma, Matricula } from './class.interface';

@Injectable({
  providedIn: 'root'
})
export class TurmaService {

  private apiUrl = '/api/Turma';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Turma[]> {
    return this.http.get<Turma[]>(this.apiUrl);
  }

  getById(id: number): Observable<Turma> {
    return this.http.get<Turma>(`${this.apiUrl}/${id}`);
  }

  create(turma: Omit<Turma, 'id' | 'alunosMatriculados'>): Observable<Turma> {
    return this.http.post<Turma>(this.apiUrl, turma);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
  // Adicione um método de update se precisar no futuro
  // update(id: number, turma: Turma): Observable<Turma> {
  //   return this.http.put<Turma>(`${this.apiUrl}/${id}`, turma);
  // }

  matricularAssociado(matricula: Matricula): Observable<any> {
    return this.http.post(`${this.apiUrl}/matricular-associado`, matricula);
  }

  desmatricularAssociado(matricula: Matricula): Observable<any> {
    return this.http.delete(`${this.apiUrl}/desmatricular-associado`, { body: matricula });
  }

  matricularDependente(matricula: Matricula): Observable<any> {
    return this.http.post(`${this.apiUrl}/matricular-dependente`, matricula);
  }

  desmatricularDependente(matricula: Matricula): Observable<any> {
    return this.http.delete(`${this.apiUrl}/desmatricular-dependente`, { body: matricula });
  }
}