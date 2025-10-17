import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FinancialService } from '../../../../services/financial/financial.service';
import { Boleto } from '../../../../services/financial/boleto.interface';
import { BoletoDetailComponent } from '../boleto-detail/boleto-detail.component';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'valor', 'vencimento', 'status'];
  dataSource = new MatTableDataSource<Boleto>([]);
  associadoNome: string = '';
  isLoading = true;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private financialService: FinancialService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const associadoId = this.route.snapshot.paramMap.get('associadoId');
    if (associadoId) {
      this.loadHistory(+associadoId);
    } else {
      this.snackBar.open('ID do associado não fornecido.', 'Fechar', { duration: 3000 });
      this.router.navigate(['/financial-dashboard']);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadHistory(associadoId: number): void {
    this.isLoading = true;
    this.financialService.getHistorico(associadoId).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.associadoNome = data[0].associado.nome;
          this.dataSource.data = data;
        } else {
          this.snackBar.open('Nenhum boleto encontrado para este associado.', 'Fechar', { duration: 3000 });
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Erro ao carregar o histórico.', 'Fechar', { duration: 3000 });
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pago': return 'status-paid';
      case 'Pendente': return 'status-pending';
      case 'Cancelado': return 'status-cancelled';
      case 'CancelamentoSolicitado': return 'status-pending-cancellation';
      case 'CancelamentoEnviado': return 'status-sent-for-cancellation';
      default: return 'status-default';
    }
  }

  formatStatus(status: string): string {
    if (!status) return '';
    const formatted = status.replace(/([A-Z])/g, ' $1').trim();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  openBoletoDetails(boletoId: number): void {
    this.financialService.getBoletoById(boletoId).subscribe({
      next: (boletoDetails) => {
        this.dialog.open(BoletoDetailComponent, {
          width: '700px',
          data: boletoDetails // Passa os dados do boleto para o modal
        });
      },
      error: () => {
        this.snackBar.open('Não foi possível carregar os detalhes do boleto.', 'Fechar', { duration: 3000 });
      }
    });
  }
}