import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from 'src/app/services/events/event.service';
import { Evento } from 'src/app/services/events/event.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.loadEventDetails(id);
    } else {
      this.snackBar.open('ID do evento não fornecido.', 'Fechar', { duration: 3000 });
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
        this.snackBar.open('Não foi possível carregar os detalhes do evento.', 'Fechar', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/list-events']);
      }
    });
  }

  // Função para deletar o evento
  deleteEvent(): void {
    if (this.event && confirm(`Tem certeza que deseja excluir o evento "${this.event.nome}"?`)) {
      this.isLoading = true;
      this.eventoService.delete(this.event.id).subscribe({
        next: () => {
          this.snackBar.open('Evento excluído com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/list-events']);
        },
        error: (err) => {
          this.snackBar.open('Erro ao excluir. Verifique se você está logado.', 'Fechar', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }

  // Função para garantir que a URL da imagem seja segura
  getSafeImageUrl(url?: string): SafeUrl | string {
    if (url) {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    return 'assets/default-activity.jpg';
  }
}