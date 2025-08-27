import { Component } from '@angular/core';
interface Activity {
  id: string;
  title: string;
  image: string;     
  short: string;
  link?: string;     
}
@Component({
  selector: 'app-cultural',
  templateUrl: './cultural.component.html',
  styleUrls: ['./cultural.component.scss']
})
export class CulturalComponent {
  activities: Activity[] = [
    { id: 'beisebol', title: 'Beisebol', image: 'assets/activities/baseball.jpg', short: 'Praticado por duas equipes, com posições de ataque e defesa usando taco e bola.' },
    { id: 'futebol', title: 'Futebol', image: 'assets/activities/futebol.jpg', short: 'Esporte nacional praticado na UCENS nas modalidades de campo e quadra.' },
    { id: 'gateball', title: 'Gateball', image: 'assets/activities/gateball.jpg', short: 'Coletivo, semelhante ao críquete, muito popular entre associados.' },
    { id: 'judo', title: 'Judô', image: 'assets/activities/judo.jpg', short: 'Arte marcial japonesa — técnica, disciplina e defesa pessoal.' },
    { id: 'karate', title: 'Karate', image: 'assets/activities/karaoke.jpg', short: 'Treinos regulares para adultos e crianças, foco em tradição e técnica.' },
    { id: 'natação', title: 'Natação', image: 'assets/activities/mallet-golf.jpg', short: 'Aulas para todas as idades, práticas e condicionamento.' },
    { id: 'yoga', title: 'Yoga', image: 'assets/activities/nitigo-gako.jpg', short: 'Alongamento, consciência corporal e relaxamento.' }
  ];
}
