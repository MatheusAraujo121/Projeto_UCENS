import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarouselImageDto } from './carousel.interface'; // Ajuste o caminho se necessário
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  
  // A URL base da sua API (bate com o [Route("api/[controller]")])
  private apiUrl = `${environment.apiUrl}/api/carousel`; 

  constructor(private http: HttpClient) { }

  /**
   * GET: Lista todas as imagens
   * Chama o seu [HttpGet] GetCarouselImages()
   */
  getImages(): Observable<CarouselImageDto[]> {
    return this.http.get<CarouselImageDto[]>(this.apiUrl);
  }

  /**
   * DELETE: Deleta uma imagem pelo ID
   * Chama o seu [HttpDelete("{id}")] DeleteCarouselImage(id)
   */
  deleteImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * POST: Faz upload de um ou mais arquivos de imagem
   * Chama o seu [HttpPost("upload")] UploadCarouselImages()
   */
  uploadImages(files: File[]): Observable<CarouselImageDto[]> {
    const formData = new FormData();
    
    // O nome 'files' DEVE bater com o argumento do C# (List<IFormFile> files)
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    // A rota é 'api/carousel/upload'
    return this.http.post<CarouselImageDto[]>(`${this.apiUrl}/upload`, formData);
  }
}