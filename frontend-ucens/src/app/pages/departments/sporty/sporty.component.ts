import { Component, OnInit } from '@angular/core';
import { AtividadeService } from 'src/app/services/activities/activity.service';
import { Atividade } from 'src/app/services/activities/activity.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Activity {
  id: string;
  title: string;
  image: string;     
  short: string;
  link?: string;     
}
@Component({
  selector: 'app-sporty',
  templateUrl: './sporty.component.html',
  styleUrls: ['./sporty.component.scss']
})
export class SportyComponent implements OnInit {
  activities: Activity[] = [];
  isLoading = true;

  constructor(
    private atividadeService: AtividadeService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.isLoading = true;
    this.atividadeService.getAll().subscribe({
      next: (data: Atividade[]) => {
        this.activities = data
          .filter(a => a.categoria === 'Esportivo')
          .map(a => ({
            id: a.id.toString(),
            title: a.nome,
            image: a.imagemUrl || 'assets/placeholder-image.jpg',
            short: a.descricao || ''
          }));
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Ocorreu um erro ao carregar as atividades esportivas.', 'Fechar', { duration: 3000 });
      }
    });
  }
}
