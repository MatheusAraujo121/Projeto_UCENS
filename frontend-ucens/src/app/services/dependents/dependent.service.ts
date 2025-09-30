import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dependent } from './dependent.interface';

@Injectable({
  providedIn: 'root'
})
export class DependentService {
  private apiUrl = '/api/dependentes';

  constructor(private http: HttpClient) { }

  getDependents(): Observable<Dependent[]> {
    return this.http.get<Dependent[]>(this.apiUrl);
  }

  getDependentById(id: number): Observable<Dependent> {
    return this.http.get<Dependent>(`${this.apiUrl}/${id}`);
  }

  createDependent(dependentData: Partial<Dependent>): Observable<Dependent> {
    return this.http.post<Dependent>(this.apiUrl, dependentData);
  }

  updateDependent(id: number, dependentData: Partial<Dependent>): Observable<Dependent> {
    return this.http.put<Dependent>(`${this.apiUrl}/${id}`, dependentData);
  }

  deleteDependent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

