import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AtividadeService } from 'src/app/services/activities/activity.service';
import { Atividade } from 'src/app/services/activities/activity.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Turma } from 'src/app/services/classes/class.interface'; 

@Component({
  selector: 'app-view-activity',
  templateUrl: './view-activity.component.html',
  styleUrls: ['./view-activity.component.scss']
})
export class ViewActivityComponent implements OnInit {

  activity: Atividade | null = null;
  isLoading = true;

  // Variáveis para a tabela de turmas
  displayedColumns: string[] = ['id', 'nome', 'professor', 'dia', 'horario', 'alunos'];
  classesDataSource = new MatTableDataSource<Turma>(); // Começa com dados vazios

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private atividadeService: AtividadeService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.loadActivityDetails(id);
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
        // Futuramente, você preencheria a tabela de turmas aqui.
        // this.classesDataSource.data = data.turmas;
        // this.classesDataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar detalhes da atividade', err);
        this.snackBar.open('Não foi possível carregar a atividade.', 'Fechar', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/list-activities']);
      }
    });
  }

  // Função de deletar adicionada
  deleteActivity(): void {
    if (this.activity && confirm(`Tem certeza que deseja excluir a atividade "${this.activity.nome}"?`)) {
      this.isLoading = true;
      this.atividadeService.delete(this.activity.id).subscribe({
        next: () => {
          this.snackBar.open('Atividade excluída com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/list-activities']);
        },
        error: (err) => {
          console.error('Erro ao excluir atividade', err);
          this.snackBar.open('Erro ao excluir a atividade. Verifique se você está logado.', 'Fechar', { duration: 3000 });
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