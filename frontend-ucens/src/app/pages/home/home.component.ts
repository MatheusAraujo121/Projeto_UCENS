import { Component, OnInit } from '@angular/core'; // Importe OnInit
import { SwiperOptions } from 'swiper';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';

// --- NOSSAS IMPORTAÇÕES ---
import { CarouselService } from '../../services/carousel/carousel.service'; // Ajuste o caminho
import { CarouselImageDto } from '../../services/carousel/carousel.interface'; // Ajuste este caminho!

SwiperCore.use([Autoplay, Navigation, Pagination]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit { // Implemente OnInit
  
  // Configurações do Swiper (sem mudanças)
  config: SwiperOptions = {
    slidesPerView: 1,
    loop: true,
    autoplay: { delay: 5000 },
    navigation: true,
    pagination: { clickable: true }
  };

  // --- NOSSAS NOVAS PROPRIEDADES ---
  carouselImages: CarouselImageDto[] = [];
  isLoading = true;

  // 1. Injete o CarouselService
  constructor(private carouselService: CarouselService) { }

  // 2. No ngOnInit, chame o serviço
  ngOnInit(): void {
    this.isLoading = true;
    this.carouselService.getImages().subscribe({
      next: (data) => {
        this.carouselImages = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar imagens do carrossel', err);
        this.isLoading = false; // Esconde o loading mesmo se der erro
      }
    });
  }
}