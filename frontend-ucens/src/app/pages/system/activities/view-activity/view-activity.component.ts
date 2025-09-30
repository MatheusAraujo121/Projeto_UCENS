import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { AtividadeService } from 'src/app/services/activities/activity.service';
import { Atividade } from 'src/app/services/activities/activity.interface';
import { Turma } from 'src/app/services/classes/class.interface';
import { TurmaService } from 'src/app/services/classes/turma.service';

@Component({
  selector: 'app-view-activity',
  templateUrl: './view-activity.component.html',
  styleUrls: ['./view-activity.component.scss']
})
export class ViewActivityComponent implements OnInit {

  activity: Atividade | null = null;
  isLoading = true;
  displayedColumns: string[] = ['nome', 'professor', 'diasHorarios', 'vagas'];
  classesDataSource = new MatTableDataSource<Turma>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private atividadeService: AtividadeService,
    private turmaService: TurmaService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.loadActivityDetails(id);
      this.loadTurmas(id);
    } else {
      this.snackBar.open('ID da atividade não fornecido.', 'Fechar', { duration: 3000 });
      this.router.navigate(['/list-activities']);
    }
  }

  loadActivityDetails(id: number): void {
    this.isLoading = true;
    this.atividadeService.getById(id).subscribe({
      next: (data) => {
        this.activity = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Não foi possível carregar a atividade.', 'Fechar', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/list-activities']);
      }
    });
  }

  loadTurmas(activityId: number): void {
    this.turmaService.getTurmasByActivityId(activityId).subscribe({
      next: (turmas) => {
        this.classesDataSource.data = turmas;
        this.classesDataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error("Erro ao carregar turmas:", err);
        this.snackBar.open('Não foi possível carregar as turmas.', 'Fechar', { duration: 3000 });
      }
    });
  }

  viewTurma(turma: Turma): void {
    this.router.navigate(['/view-class', turma.id]);
  }

  deleteActivity(): void {
    if (this.activity && confirm(`Tem certeza que deseja excluir a atividade "${this.activity.nome}"?`)) {
      this.isLoading = true;
      this.atividadeService.delete(this.activity.id).subscribe({
        next: () => {
          this.snackBar.open('Atividade excluída com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/list-activities']);
        },
        error: (err) => {
          this.snackBar.open('Erro ao excluir a atividade.', 'Fechar', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }

  getSafeImageUrl(url?: string): SafeUrl | string {
    if (url) {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    return 'assets/placeholder-image.jpg';
  }
}