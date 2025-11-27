import { Component, OnInit } from '@angular/core';
import { CarouselService } from '../../../../services/carousel/carousel.service'; // Ajuste o caminho
import { CarouselImageDto } from '../../../../services/carousel/carousel.interface'; // Ajuste o caminho
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-manage-carousel',
  templateUrl: './manage-carousel.component.html',
  styleUrls: ['./manage-carousel.component.scss']
})
export class ManageCarouselComponent implements OnInit {
images: CarouselImageDto[] = [];
  selectedFiles: File[] = [];
  
  previewUrls: string[] = []; 
  
  isLoading = false;
  uploadError: string | null = null;
  
  constructor(private carouselService: CarouselService) { }

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.isLoading = true;
    this.carouselService.getImages().subscribe({
      next: (data) => {
        this.images = data;
        this.isLoading = false;
      },
      error: () => {
        this.uploadError = 'Falha ao carregar imagens.';
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.selectedFiles = [];
    this.previewUrls = []; 
    this.uploadError = null;

    if (input.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files);

      for (const file of this.selectedFiles) {
        const reader = new FileReader();
        
        reader.onload = (e: any) => {
          this.previewUrls.push(e.target.result);
        };

        reader.readAsDataURL(file);
      }
    }
  }

  onUpload(): void {
    if (this.selectedFiles.length === 0) return; 

    this.isLoading = true;
    this.uploadError = null;

    this.carouselService.uploadImages(this.selectedFiles).subscribe({
      next: (uploadedImages) => {
        this.images.push(...uploadedImages);
        
        this.selectedFiles = []; 
        this.previewUrls = []; 
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.uploadError = 'Erro ao enviar. Verifique o tamanho ou formato do arquivo.';
        this.isLoading = false;
      }
    });
  }

  onDelete(id: number): void {
    if (confirm('Tem certeza que deseja remover esta imagem?')) {
      this.carouselService.deleteImage(id).subscribe({
        next: () => {
          this.images = this.images.filter(img => img.id !== id);
        },
        error: (err) => {
          alert('Erro ao deletar imagem.');
        }
      });
    }
  }
}