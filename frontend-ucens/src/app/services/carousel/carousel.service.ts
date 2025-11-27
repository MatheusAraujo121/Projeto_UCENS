import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarouselImageDto } from './carousel.interface';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  
  private apiUrl = `${environment.apiUrl}/api/carousel`; 

  constructor(private http: HttpClient) { }

  getImages(): Observable<CarouselImageDto[]> {
    return this.http.get<CarouselImageDto[]>(this.apiUrl);
  }

  deleteImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadImages(files: File[]): Observable<CarouselImageDto[]> {
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    return this.http.post<CarouselImageDto[]>(`${this.apiUrl}/upload`, formData);
  }
}