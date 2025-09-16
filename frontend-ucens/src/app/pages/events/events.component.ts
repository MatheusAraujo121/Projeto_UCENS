import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';

interface EventCard {
  id: string;
  title: string;
  image: string;
  short: string;
  date: string;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {
  events: EventCard[] = [
    {
      id: '1',
      title: 'Festa Junina 2025',
      image: 'assets/activities/social-artistico.jpg',
      short: 'Venha celebrar conosco com comidas típicas, danças e muita diversão para toda a família na nossa tradicional Festa Junina.',
      date: '20 a 22 de Junho de 2025'
    },
    {
      id: '2',
      title: 'Bon Odori 2025',
      image: 'assets/activities/fujin-bu.jpg',
      short: 'Participe do nosso festival de dança folclórica japonesa em homenagem aos antepassados, um evento de grande importância cultural.',
      date: '15 e 16 de Agosto de 2025'
    },
    {
      id: '3',
      title: 'Undokai - Gincana Esportiva',
      image: 'assets/img/undokai.jpg',
      short: 'Um dia de muita alegria e competição saudável para todas as idades, com gincanas e brincadeiras tradicionais.',
      date: 'Maio de 2025'
    }
  ];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: ptBrLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    weekends: true,
    aspectRatio: 2,
    events: [
      {
        id: '1',
        title: 'Festa Junina',
        start: '2025-06-20',
        end: '2025-06-23',
        backgroundColor: '#d32f2f',
        borderColor: '#d32f2f',
      },
      {
        id: '2',
        title: 'Bon Odori',
        start: '2025-08-15',
        end: '2025-08-17',
        backgroundColor: '#1976d2',
        borderColor: '#1976d2',
      }
    ]
  };
}