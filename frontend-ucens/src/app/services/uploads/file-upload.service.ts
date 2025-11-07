import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type UploadType = 'activities' | 'events' | 'despesas';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private apiUrl = '/api/File';

  constructor(private http: HttpClient) { }

  uploadImage(file: File, type: UploadType): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('type', type); 

    return this.http.post<{ url: string }>(`${this.apiUrl}/upload`, formData);
  }
}