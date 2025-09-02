import { Component } from '@angular/core';

interface Activity {
  id: string;
  title: string;
  image: string;     // caminho dentro de assets
  short: string;
  link?: string;     // rota ou url para "saiba mais"
}

@Component({
  selector: 'app-list-activities',
  templateUrl: './list-activities.component.html',
  styleUrls: ['./list-activities.component.scss']
})

export class ListActivitiesComponent {
  activities: Activity[] = [
    { id: '1', title: 'Beisebol', image: 'assets/activities/baseball.jpg', short: 'Praticado por duas equipes, com posições de ataque e defesa usando taco e bola.' },
    { id: '2', title: 'Futebol', image: 'assets/activities/futebol.jpg', short: 'Esporte nacional praticado na UCENS nas modalidades de campo e quadra.' },
    { id: '3', title: 'Gateball', image: 'assets/activities/gateball.jpg', short: 'Coletivo, semelhante ao críquete, muito popular entre associados.' },
    { id: '4', title: 'Judô', image: 'assets/activities/judo.jpg', short: 'Arte marcial japonesa — técnica, disciplina e defesa pessoal.' },
    { id: '5', title: 'Karate', image: 'assets/activities/karaoke.jpg', short: 'Treinos regulares para adultos e crianças, foco em tradição e técnica.' },
    { id: '6', title: 'Natação', image: 'assets/activities/mallet-golf.jpg', short: 'Aulas para todas as idades, práticas e condicionamento.' },
    { id: '7', title: 'Yoga', image: 'assets/activities/nitigo-gako.jpg', short: 'Alongamento, consciência corporal e relaxamento.' }
  ];
}
