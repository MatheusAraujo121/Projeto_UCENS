import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from 'src/app/services/events/event.service';
import { Evento } from 'src/app/services/events/event.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.scss']
})
export class EventInfoComponent implements OnInit {

  event: Evento | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventoService: EventoService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const eventId = +idParam;
      this.loadEvent(eventId);
    } else {
      this.snackBar.open('ID do evento não encontrado.', 'Fechar', { duration: 3000 });
      this.router.navigate(['/events']);
    }
  }

  loadEvent(id: number): void {
    this.isLoading = true;
    this.eventoService.getById(id).subscribe({
      next: (data) => {
        this.event = data;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Não foi possível carregar o evento.', 'Fechar', { duration: 3000 });
        this.router.navigate(['/events']);
        this.isLoading = false;
      }
    });
  }
}
