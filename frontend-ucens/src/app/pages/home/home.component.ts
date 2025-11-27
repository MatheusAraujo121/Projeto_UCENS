import { Component, OnInit } from '@angular/core'; 
import { SwiperOptions } from 'swiper';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';

import { CarouselService } from '../../services/carousel/carousel.service'; 
import { CarouselImageDto } from '../../services/carousel/carousel.interface'; 

SwiperCore.use([Autoplay, Navigation, Pagination]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit { 
  
  config: SwiperOptions = {
    slidesPerView: 1,
    loop: true,
    autoplay: { delay: 5000 },
    navigation: true,
    pagination: { clickable: true }
  };

  carouselImages: CarouselImageDto[] = [];
  isLoading = true;

  constructor(private carouselService: CarouselService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.carouselService.getImages().subscribe({
      next: (data) => {
        this.carouselImages = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar imagens do carrossel', err);
        this.isLoading = false; 
      }
    });
  }
}