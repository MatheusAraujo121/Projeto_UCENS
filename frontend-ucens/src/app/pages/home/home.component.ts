import { Component, OnInit } from '@angular/core'; 
import { SwiperOptions } from 'swiper';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import { MatSnackBar } from '@angular/material/snack-bar'; 

import { CarouselService } from '../../services/carousel/carousel.service'; 
import { CarouselImageDto } from '../../services/carousel/carousel.interface'; 
import { ContactService } from '../../services/contact/contact.service';
import { Contato } from '../../services/contact/contact.interface'; 

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

  contato: Contato = {
    nome: '',
    email: '',
    mensagem: ''
  };

  constructor(
    private carouselService: CarouselService,
    private contactService: ContactService, 
    private snackBar: MatSnackBar 
  ) { }

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
  enviarEmail() {
    if (!this.contato.nome || !this.contato.email || !this.contato.mensagem) {
      this.snackBar.open('Por favor, preencha todos os campos.', 'Fechar', { duration: 3000 });
      return;
    }

    this.contactService.enviarMensagem(this.contato).subscribe({
      next: () => {
        this.snackBar.open('Mensagem enviada com sucesso!', 'Fechar', { duration: 3000 });
        this.contato = { nome: '', email: '', mensagem: '' };
      },
      error: (err) => {
        console.error('Erro ao enviar mensagem', err);
        this.snackBar.open('Erro ao enviar mensagem. Tente novamente.', 'Fechar', { duration: 3000 });
      }
    });
  }
}
