import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { EventoService } from 'src/app/services/events/event.service';
import { Evento } from 'src/app/services/events/event.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

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
export class EventsComponent implements OnInit {
  events: EventCard[] = [];
  isLoading = true;

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
    events: []
  };

  constructor(
    private eventoService: EventoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventoService.getAll().subscribe({
      next: (data: Evento[]) => {
        this.events = data.map(this.mapToEventCard);
        this.calendarOptions.events = data.map(event => ({
          id: event.id.toString(),
          title: event.nome,
          start: event.inicio,
          end: event.fim,
          backgroundColor: '#d32f2f', // Cor para eventos no calendário
          borderColor: '#d32f2f'
        }));
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Falha ao carregar os eventos.', 'Fechar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  private mapToEventCard(event: Evento): EventCard {
    const startDate = new Date(event.inicio);
    const endDate = new Date(event.fim);

    // Ajusta para o fuso horário local para evitar problemas de data
    const userTimezoneOffset = startDate.getTimezoneOffset() * 60000;
    const localStartDate = new Date(startDate.getTime() + userTimezoneOffset);
    const localEndDate = new Date(endDate.getTime() + userTimezoneOffset);

    const formatOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    const startDateFormatted = localStartDate.toLocaleDateString('pt-BR', formatOptions);
    
    let dateString = '';
    
    if (localStartDate.toDateString() === localEndDate.toDateString()) {
        dateString = localEndDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    } else if (localStartDate.getMonth() === localEndDate.getMonth() && localStartDate.getFullYear() === localEndDate.getFullYear()) {
        dateString = `${localStartDate.getDate()} a ${localEndDate.getDate()} de ${localEndDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
    } else {
        const endDateFormatted = localEndDate.toLocaleDateString('pt-BR', { ...formatOptions, year: 'numeric' });
        dateString = `${startDateFormatted} a ${endDateFormatted}`;
    }

    return {
      id: event.id.toString(),
      title: event.nome,
      image: event.imagemUrl || 'assets/placeholder-image.jpg',
      short: event.descricao || '',
      date: dateString
    };
  }
}
