import { Component } from '@angular/core';

// módulos do Swiper
import { SwiperOptions } from 'swiper';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';

SwiperCore.use([Autoplay, Navigation, Pagination]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // configurações do Swiper
  config: SwiperOptions = {
    slidesPerView: 1,
    loop: true,
    autoplay: { delay: 5000 },
    navigation: true,
    pagination: { clickable: true }
  };
}
