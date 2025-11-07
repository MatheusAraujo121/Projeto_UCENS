import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Turma, MatriculaDTO } from './class.interface';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class TurmaService {
  private apiUrl = `${environment.apiUrl}/api/Turma`;

  constructor(private http: HttpClient) {}

  getTurmas(): Observable<Turma[]> {
    return this.http.get<Turma[]>(this.apiUrl);
  }

  getTurmaById(id: number): Observable<Turma> {
    return this.http.get<Turma>(`${this.apiUrl}/${id}`);
  }

  getTurmasByActivityId(activityId: number): Observable<Turma[]> {
    return this.http.get<Turma[]>(`${this.apiUrl}/por-atividade/${activityId}`);
  }

  createTurma(turma: Omit<Turma, 'id' | 'alunosMatriculados'>): Observable<Turma> {
    return this.http.post<Turma>(this.apiUrl, turma);
  }

  updateTurma(id: number, turma: Turma): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, turma);
  }

  deleteTurma(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  matricularAssociado(matricula: MatriculaDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/matricular-associado`, matricula, { responseType: 'text' });
  }

  matricularDependente(matricula: MatriculaDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/matricular-dependente`, matricula, { responseType: 'text' });
  }

  desmatricularAssociado(matricula: MatriculaDTO): Observable<any> {
    return this.http.delete(`${this.apiUrl}/desmatricular-associado`, { body: matricula, responseType: 'text' });
  }

  desmatricularDependente(matricula: MatriculaDTO): Observable<any> {
    return this.http.delete(`${this.apiUrl}/desmatricular-dependente`, { body: matricula, responseType: 'text' });
  }
}