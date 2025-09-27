import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDialog } from '@angular/material/dialog';
import { EventDetailComponent } from '../event-detail/event-detail.component';
import { EventoService } from 'src/app/services/events/event.service';
import { Evento } from 'src/app/services/events/event.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-events',
  templateUrl: './list-events.component.html',
  styleUrls: ['./list-events.component.scss']
})
export class ListEventsComponent implements OnInit {

  isLoading = true; // <-- Variável adicionada

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    eventClick: this.handleEventClick.bind(this),
    events: [],
    locale: 'pt-br',
    buttonText: {
      today: 'Hoje'
    }
  };

  constructor(
    public dialog: MatDialog,
    private eventoService: EventoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventoService.getAll().subscribe({
      next: (data) => {
        this.calendarOptions.events = data.map(event => ({
          id: event.id.toString(),
          title: event.nome,
          start: event.inicio,
          end: event.fim,
          extendedProps: {
            description: event.descricao,
            local: event.local,
            imagemUrl: event.imagemUrl
          }
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Erro ao carregar eventos", err);
        this.snackBar.open('Não foi possível carregar os eventos.', 'Fechar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  handleEventClick(clickInfo: EventClickArg): void {
    this.dialog.open(EventDetailComponent, {
      width: '600px',
      data: { event: clickInfo.event }
    });
  }
}