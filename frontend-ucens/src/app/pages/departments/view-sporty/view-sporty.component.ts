import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AtividadeService } from 'src/app/services/activities/activity.service';
import { Atividade } from 'src/app/services/activities/activity.interface';

@Component({
  selector: 'app-view-sporty',
  templateUrl: './view-sporty.component.html',
  styleUrls: ['./view-sporty.component.scss']
})
export class ViewSportyComponent implements OnInit {
  
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
      this.router.navigate(['/departments/sporty']);
    }
  }

  loadActivity(id: number): void {
    this.isLoading = true;
    this.atividadeService.getById(id).subscribe({
      next: (data) => {
        if (data.categoria !== 'Esportivo') {
            this.snackBar.open('Esta atividade não é da categoria esportiva.', 'Fechar', { duration: 3000 });
            this.router.navigate(['/departments/sporty']);
            return;
        }
        this.activity = data;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Não foi possível carregar a atividade.', 'Fechar', { duration: 3000 });
        this.router.navigate(['/departments/sporty']);
        this.isLoading = false;
      }
    });
  }
}
