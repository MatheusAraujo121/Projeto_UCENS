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

  // A lista de associados foi removida daqui.
  associado: Associate | null = null; // Armazena o associado atual
  public associadoIds: number[] = [];
  public currentIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private associateService: AssociateService  // Injeta o serviço
  ) { }

  ngOnInit() {
    // Usamos switchMap para lidar com mudanças de rota sem múltiplas inscrições
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const id = +idParam;
        this.loadAllIdsAndSetCurrent(id);
      }
    });
  }

  // Carrega todos os IDs e depois busca os dados do associado atual
  private loadAllIdsAndSetCurrent(currentId: number): void {
    this.associateService.getAssociadoIds().subscribe(ids => {
      this.associadoIds = ids;
      this.currentIndex = this.associadoIds.findIndex(id => id === currentId);
      this.loadAssociado(currentId);
    });
  }

  // Busca os dados de um associado específico na API
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

  // Navega para o associado anterior na lista de IDs
  anterior() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      const prevId = this.associadoIds[this.currentIndex];
      this.router.navigate(['/view-associates', prevId]);
    }
  }

  // Navega para o próximo associado na lista de IDs
  proximo() {
    if (this.currentIndex < this.associadoIds.length - 1) {
      this.currentIndex++;
      const nextId = this.associadoIds[this.currentIndex];
      this.router.navigate(['/view-associates', nextId]);
    }
  }

  // Adiciona a função de exclusão
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