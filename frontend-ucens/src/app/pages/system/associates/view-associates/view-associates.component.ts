import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssociateService } from 'src/app/services/associates/associate.service';
import { Associate } from 'src/app/services/associates/associate.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-associates',
  templateUrl: './view-associates.component.html',
  styleUrls: ['./view-associates.component.scss']
})
export class ViewAssociatesComponent implements OnInit {

  associado: Associate | null = null;
  public associadoIds: number[] = [];
  public currentIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private associateService: AssociateService  
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const id = +idParam;
        this.loadAllIdsAndSetCurrent(id);
      }
    });
  }

  private loadAllIdsAndSetCurrent(currentId: number): void {
    this.associateService.getAssociadoIds().subscribe(ids => {
      this.associadoIds = ids;
      this.currentIndex = this.associadoIds.findIndex(id => id === currentId);
      this.loadAssociado(currentId);
    });
  }

  private loadAssociado(id: number): void {
    this.associateService.getAssociado(id).subscribe({
      next: (data) => {
        this.associado = data;
      },
      error: (err) => {
        this.router.navigate(['/list-associates']);
      }
    });
  }

  anterior() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      const prevId = this.associadoIds[this.currentIndex];
      this.router.navigate(['/view-associates', prevId]);
    }
  }

  proximo() {
    if (this.currentIndex < this.associadoIds.length - 1) {
      this.currentIndex++;
      const nextId = this.associadoIds[this.currentIndex];
      this.router.navigate(['/view-associates', nextId]);
    }
  }

  excluir() {
    if (this.associado) {
      if (confirm(`Tem certeza que deseja excluir o associado ${this.associado.nome}?`)) {
        this.associateService.deleteAssociado(this.associado.id).subscribe({
          next: () => {
            this.snackBar.open('Associado excluído com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigate(['/list-associates']);
          },
          error: (err) => {
            this.snackBar.open('Erro ao excluir associado!', 'Fechar', { duration: 3000 });
          }
        });
      }
    }
  }
}