import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TurmaService } from 'src/app/services/classes/turma.service';
import { Turma, AlunoMatriculado, MatriculaDTO } from 'src/app/services/classes/class.interface';
import { AssociateService } from 'src/app/services/associates/associate.service';
import { DependentService } from 'src/app/services/dependents/dependent.service';
import { Associate } from 'src/app/services/associates/associate.interface';
import { Dependent } from 'src/app/services/dependents/dependent.interface';

@Component({
  selector: 'app-view-class',
  templateUrl: './view-class.component.html',
  styleUrls: ['./view-class.component.scss']
})
export class ViewClassComponent implements OnInit {

  turma: Turma | null = null;
  isLoading = true;
  isTurmaLotada = false; 
  displayedColumns: string[] = ['nome', 'tipo', 'acoes'];
  alunosDataSource = new MatTableDataSource<AlunoMatriculado>();

  diasDaSemana: string = 'N/A';
  horario: string = 'N/A';

  showAssociadoModal = false;
  showDependenteModal = false;
  searchTerm = '';
  
  private allAssociados: Associate[] = [];
  private allDependentes: Dependent[] = [];
  
  filteredAssociados: Associate[] = [];
  filteredDependentes: Dependent[] = [];

  @ViewChild(MatPaginator)
  set paginator(paginator: MatPaginator) {
    this.alunosDataSource.paginator = paginator;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private turmaService: TurmaService,
    private associadoService: AssociateService,
    private dependenteService: DependentService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.loadTurmaDetails(id);
    } else {
      this.snackBar.open('ID da turma não fornecido.', 'Fechar', { duration: 3000 });
      this.router.navigate(['/list-activities']);
    }
  }

  loadTurmaDetails(id: number, refresh: boolean = false): void {
    if (!refresh) this.isLoading = true;
    this.turmaService.getTurmaById(id).subscribe({
      next: (data) => {
        this.turma = data;
        this.alunosDataSource.data = data.alunosMatriculados;
        this.isTurmaLotada = data.alunosMatriculados.length >= data.vagas;
        
        if (data.diasHorarios && data.diasHorarios.includes(' às ')) {
          const parts = data.diasHorarios.split(' às ');
          this.diasDaSemana = parts[0];
          this.horario = parts[1];
        } else {
          this.diasDaSemana = data.diasHorarios || 'N/A';
        }
        
        if (!refresh) this.isLoading = false;
      },
      error: (err) => {
        if (!refresh) {
          this.snackBar.open('Não foi possível carregar os detalhes da turma.', 'Fechar', { duration: 3000 });
          this.isLoading = false;
          this.router.navigate(['/list-activities']);
        }
      }
    });
  }

  openAssociadoModal(): void {
    if (this.isTurmaLotada) {
      this.snackBar.open('Esta turma está lotada!', 'Fechar', { duration: 3000 });
      return;
    }
    this.associadoService.getAssociados().subscribe(data => {
      this.allAssociados = data;
      this.filterAssociados();
      this.showAssociadoModal = true;
    });
  }

  openDependenteModal(): void {
    if (this.isTurmaLotada) {
      this.snackBar.open('Esta turma está lotada!', 'Fechar', { duration: 3000 });
      return;
    }
    this.dependenteService.getDependents().subscribe(data => {
      this.allDependentes = data;
      this.filterDependentes();
      this.showDependenteModal = true;
    });
  }

  filterAssociados(): void {
    const matriculadosIds = this.turma?.alunosMatriculados.filter(a => a.tipo === 'Associado').map(a => a.id) || [];
    this.filteredAssociados = this.allAssociados.filter(a => 
      !matriculadosIds.includes(a.id) && a.nome.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  filterDependentes(): void {
    const matriculadosIds = this.turma?.alunosMatriculados.filter(a => a.tipo === 'Dependente').map(a => a.id) || [];
    this.filteredDependentes = this.allDependentes.filter(d => 
      !matriculadosIds.includes(d.id) && d.nome.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  matricular(alunoId: number, tipo: 'Associado' | 'Dependente'): void {
    if (!this.turma) return;

    const dto: MatriculaDTO = { turmaId: this.turma.id, alunoId: alunoId };
    const serviceCall = tipo === 'Associado' 
      ? this.turmaService.matricularAssociado(dto)
      : this.turmaService.matricularDependente(dto);

    serviceCall.subscribe({
      next: () => {
        this.snackBar.open(`${tipo} matriculado com sucesso!`, 'Fechar', { duration: 3000 });
        this.loadTurmaDetails(this.turma!.id, true);
        this.showAssociadoModal = false;
        this.showDependenteModal = false;
        this.searchTerm = '';
      },
      error: () => this.snackBar.open(`Erro ao matricular ${tipo}.`, 'Fechar', { duration: 3000 })
    });
  }

  desmatricularAluno(aluno: AlunoMatriculado): void {
    if (!this.turma || !confirm(`Tem certeza que deseja desmatricular ${aluno.nome}?`)) return;

    const dto: MatriculaDTO = { turmaId: this.turma.id, alunoId: aluno.id };
    const serviceCall = aluno.tipo === 'Associado'
      ? this.turmaService.desmatricularAssociado(dto)
      : this.turmaService.desmatricularDependente(dto);

    serviceCall.subscribe({
      next: () => {
        this.snackBar.open(`${aluno.tipo} desmatriculado com sucesso!`, 'Fechar', { duration: 3000 });
        this.loadTurmaDetails(this.turma!.id, true);
      },
      error: () => this.snackBar.open(`Erro ao desmatricular ${aluno.tipo}.`, 'Fechar', { duration: 3000 })
    });
  }

  goBack(): void {
    if (this.turma) {
      this.router.navigate(['/view-activity', this.turma.atividadeId]);
    } else {
      this.router.navigate(['/list-activities']);
    }
  }

  editTurma(): void {
    if (!this.turma) return;
    this.router.navigate(['/edit-class', this.turma.id]);
  }

  deleteTurma(): void {
    if (this.turma && confirm(`Tem certeza que deseja excluir a turma "${this.turma.nome}"?`)) {
        this.turmaService.deleteTurma(this.turma.id).subscribe({
            next: () => {
                this.snackBar.open('Turma excluída com sucesso!', 'Fechar', { duration: 3000 });
                this.goBack();
            },
            error: () => this.snackBar.open('Erro ao excluir a turma.', 'Fechar', { duration: 3000 })
        });
    }
  }
}