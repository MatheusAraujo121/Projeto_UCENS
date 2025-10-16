import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { AssociateService } from 'src/app/services/associates/associate.service';
import { FinancialService } from 'src/app/services/financial/financial.service';
import { Associate } from 'src/app/services/associates/associate.interface';
import { Boleto } from 'src/app/services/financial/boleto.interface';
import { BoletoDetailComponent } from 'src/app/pages/system/financial/boleto-detail/boleto-detail.component';

@Component({
  selector: 'app-view-associates',
  templateUrl: './view-associates.component.html',
  styleUrls: ['./view-associates.component.scss']
})
export class ViewAssociatesComponent implements OnInit, AfterViewInit {

  associado: Associate | null = null;
  public associadoIds: number[] = [];
  public currentIndex = 0;
  isLoading = true;

  boletosDataSource = new MatTableDataSource<Boleto>([]);
  displayedColumns: string[] = ['id', 'valor', 'vencimento', 'status'];
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private associateService: AssociateService,
    private financialService: FinancialService,
    public dialog: MatDialog
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

  ngAfterViewInit() {
    // A configuração inicial permanece aqui
    this.boletosDataSource.sort = this.sort;
    this.boletosDataSource.paginator = this.paginator;
  }

  private loadAllIdsAndSetCurrent(currentId: number): void {
    this.associateService.getAssociadoIds().subscribe(ids => {
      this.associadoIds = ids;
      this.currentIndex = this.associadoIds.findIndex(id => id === currentId);
      this.loadAssociado(currentId);
    });
  }

  private loadAssociado(id: number): void {
    this.isLoading = true;
    this.associateService.getAssociado(id).subscribe({
      next: (data) => {
        this.associado = data;
        this.loadBoletos(id);
      },
      error: (err) => {
        this.router.navigate(['/list-associates']);
        this.isLoading = false;
      }
    });
  }

  // MÉTODO ATUALIZADO
  private loadBoletos(associadoId: number): void {
    this.financialService.getHistorico(associadoId).subscribe({
      next: (boletos) => {
        this.boletosDataSource.data = boletos;
        // *** CORREÇÃO APLICADA AQUI ***
        // Reconectamos o paginador à fonte de dados toda vez que novos dados chegam.
        this.boletosDataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar o histórico financeiro do associado.', 'Fechar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  openBoletoDetails(boletoId: number): void {
    this.financialService.getBoletoById(boletoId).subscribe({
      next: (boletoDetails) => {
        this.dialog.open(BoletoDetailComponent, {
          width: '700px',
          data: boletoDetails
        });
      },
      error: () => {
        this.snackBar.open('Não foi possível carregar os detalhes do boleto.', 'Fechar', { duration: 3000 });
      }
    });
  }
  
  formatStatus(status: string): string {
    if (!status) return '';
    const formatted = status.replace(/([A-Z])/g, ' $1').trim();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pago': return 'status-paid';
      case 'Pendente': return 'status-pending';
      case 'Cancelado': return 'status-cancelled';
      case 'CancelamentoSolicitado': return 'status-pendingcancelled';
      case 'CancelamentoEnviado': return 'status-sent-for-cancellation';
      default: return 'status-default';
    }
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