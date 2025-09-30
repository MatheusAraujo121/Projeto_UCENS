import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AtividadeService } from 'src/app/services/activities/activity.service';
import { Atividade } from 'src/app/services/activities/activity.interface';

@Component({
  selector: 'app-view-cultural',
  templateUrl: './view-cultural.component.html',
  styleUrls: ['./view-cultural.component.scss']
})
export class ViewCulturalComponent implements OnInit {
  
  activity: Atividade | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private atividadeService: AtividadeService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const activityId = +idParam;
      this.loadActivity(activityId);
    } else {
      this.snackBar.open('ID da atividade não encontrado.', 'Fechar', { duration: 3000 });
      this.router.navigate(['/departments/cultural']);
    }
  }

  loadActivity(id: number): void {
    this.isLoading = true;
    this.atividadeService.getById(id).subscribe({
      next: (data) => {
        if (data.categoria !== 'Cultural') {
            this.snackBar.open('Esta atividade não é da categoria cultural.', 'Fechar', { duration: 3000 });
            this.router.navigate(['/departments/cultural']);
            return;
        }
        this.activity = data;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Não foi possível carregar a atividade.', 'Fechar', { duration: 3000 });
        this.router.navigate(['/departments/cultural']);
        this.isLoading = false;
      }
    });
  }
}
