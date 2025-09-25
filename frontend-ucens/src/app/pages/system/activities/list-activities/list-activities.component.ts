import { Component, OnInit } from '@angular/core';
import { AtividadeService } from 'src/app/services/activities/activity.service';
import { Atividade } from 'src/app/services/activities/activity.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-activities',
  templateUrl: './list-activities.component.html',
  styleUrls: ['./list-activities.component.scss']
})
export class ListActivitiesComponent implements OnInit {

  atividadesEsportivas: Atividade[] = [];
  atividadesCulturais: Atividade[] = [];
  
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
      next: (data) => {
        this.atividadesEsportivas = data.filter(a => a.categoria === 'Esportivo');
        this.atividadesCulturais = data.filter(a => a.categoria === 'Cultural');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar atividades', error);
        this.isLoading = false;
        this.snackBar.open('Ocorreu um erro ao carregar as atividades.', 'Fechar', { duration: 3000 });
      }
    });
  }
}