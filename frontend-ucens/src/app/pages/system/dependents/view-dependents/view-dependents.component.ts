import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DependentService } from 'src/app/services/dependents/dependent.service';
import { Dependent } from 'src/app/services/dependents/dependent.interface';
import { AssociateService } from 'src/app/services/associates/associate.service';

@Component({
  selector: 'app-view-dependents',
  templateUrl: './view-dependents.component.html',
  styleUrls: ['./view-dependents.component.scss']
})
export class ViewDependentsComponent implements OnInit {
  dependent: Dependent | null = null;
  associateName: string = 'Carregando...';
  dependentIds: number[] = [];
  currentIndex: number = 0;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dependentService: DependentService,
    private associateService: AssociateService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const id = Number(params.get('id'));
        if (isNaN(id) || id <= 0) {
          this.handleInvalidId();
          return of(null); 
        }
        return this.loadData(id);
      })
    ).subscribe({
      next: (associado) => {
        if (associado) {
          this.associateName = associado.nome;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open('Falha ao carregar os dados. Verifique o ID e tente novamente.', 'Fechar', { duration: 3000 });
        this.router.navigate(['/list-dependents']);
      }
    });
  }

  private handleInvalidId(): void {
    this.snackBar.open('ID do dependente inválido!', 'Fechar', { duration: 3000 });
    this.router.navigate(['/list-dependents']);
    this.isLoading = false;
  }

  loadData(id: number) {
    this.isLoading = true;
    return forkJoin({
      dependent: this.dependentService.getDependentById(id),
      allDependents: this.dependentService.getDependents()
    }).pipe(
      switchMap(({ dependent, allDependents }) => {
        if (!dependent) {
          throw new Error('Dependente não encontrado');
        }
        this.dependent = dependent;
        this.dependentIds = allDependents.map(d => d.id).sort((a, b) => a - b);
        this.currentIndex = this.dependentIds.findIndex(depId => depId === id);
        
        return this.associateService.getAssociado(dependent.associadoId);
      })
    );
  }

  formatDate(date: any): string {
    if (!date) return '';
    try {
      const d = new Date(date);
      const userTimezoneOffset = d.getTimezoneOffset() * 60000;
      const adjustedDate = new Date(d.getTime() + userTimezoneOffset);
      const month = ('0' + (adjustedDate.getMonth() + 1)).slice(-2);
      const day = ('0' + adjustedDate.getDate()).slice(-2);
      return `${adjustedDate.getFullYear()}-${month}-${day}`;
    } catch (e) {
      return '';
    }
  }

  anterior() {
    if (this.currentIndex > 0) {
      const prevId = this.dependentIds[this.currentIndex - 1];
      this.router.navigate(['/view-dependents', prevId]);
    }
  }

  proximo() {
    if (this.currentIndex < this.dependentIds.length - 1) {
      const nextId = this.dependentIds[this.currentIndex + 1];
      this.router.navigate(['/view-dependents', nextId]);
    }
  }

  deleteDependent(): void {
    if (!this.dependent) return;
    if (confirm(`Tem certeza que deseja excluir o dependente ${this.dependent.nome}?`)) {
      this.dependentService.deleteDependent(this.dependent.id).subscribe({
        next: () => {
          this.snackBar.open('Dependente excluído com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/list-dependents']);
        },
        error: (err) => {
          this.snackBar.open('Ocorreu um erro ao tentar excluir o dependente.', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  voltarLista(): void {
    this.router.navigate(['/list-dependents']);
  }
}