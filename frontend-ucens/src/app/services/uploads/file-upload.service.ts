import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

// Adicionei 'carousel' ao seu UploadType, pois o FileController permite.
export type UploadType = 'activities' | 'events' | 'despesas' | 'carousel';

@Injectable({
 providedIn: 'root'
})
export class FileUploadService {

  private apiUrl = `${environment.apiUrl}/api/File`;

  constructor(private http: HttpClient) { }

  // ▼▼▼ CORREÇÃO AQUI ▼▼▼
  // Altere o tipo de retorno para incluir o 'fileId'
  uploadImage(file: File, type: UploadType): Observable<{ url: string; fileId: string; }> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('type', type); 

    // E altere o tipo de retorno do 'post' aqui também
    return this.http.post<{ url: string; fileId: string; }>(`${this.apiUrl}/upload`, formData);
  }
}