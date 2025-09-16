import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { MatDialog } from '@angular/material/dialog';
import { EventDetailComponent } from '../event-detail/event-detail.component';

@Component({
  selector: 'app-list-events',
  templateUrl: './list-events.component.html',
  styleUrls: ['./list-events.component.scss']
})
export class ListEventsComponent {

  constructor(private router: Router, public dialog: MatDialog) { }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: ptBrLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
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
        extendedProps: {
          description: 'Tradicional festa com comidas típicas, danças e brincadeiras para toda a família.',
          imageUrl: 'assets/activities/karate.jpg' 
        }
      },
      { 
        id: '2',
        title: 'Bon Odori', 
        start: '2025-08-15', 
        end: '2025-08-17',
        backgroundColor: '#1976d2',
        borderColor: '#1976d2',
        extendedProps: {
          description: 'Festival de dança folclórica japonesa em homenagem aos antepassados, realizado na Praça Kasato Maru.',
          imageUrl: 'assets/activities/karate.jpg' 
        }
      }
    ],
    eventClick: this.handleEventClick.bind(this),
  };

  handleEventClick(clickInfo: EventClickArg) {
    this.dialog.open(EventDetailComponent, {
      data: {
        event: clickInfo.event
      },
      width: '500px',
      maxWidth: '90vw' 
    });
  }

  navigateToCreateEvent(): void {
    this.router.navigate(['/create-event']);
  }
}