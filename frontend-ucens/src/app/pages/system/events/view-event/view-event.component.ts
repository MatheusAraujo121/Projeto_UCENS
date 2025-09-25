import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from 'src/app/services/events/event.service';
import { Evento } from 'src/app/services/events/event.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.scss']
})
export class ViewEventComponent implements OnInit {

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
      const id = +idParam;
      this.loadEventDetails(id);
    } else {
      this.router.navigate(['/list-events']);
    }
  }

  loadEventDetails(id: number): void {
    this.isLoading = true;
    this.eventoService.getById(id).subscribe({
      next: (data) => {
        this.event = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar detalhes do evento', err);
        this.snackBar.open('Não foi possível carregar o evento.', 'Fechar', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/list-events']);
      }
    });
  }
}