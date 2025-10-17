import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FinancialService } from '../../../../services/financial/financial.service';
import { Boleto } from '../../../../services/financial/boleto.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-financial-dashboard',
  templateUrl: './financial-dashboard.component.html',
  styleUrls: ['./financial-dashboard.component.scss']
})
export class FinancialDashboardComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nome', 'valor', 'vencimento', 'status', 'acoes'];
  dataSource = new MatTableDataSource<Boleto>([]);

  filterNome = new FormControl('');
  filterStatus = new FormControl('');
  filterGlobal = new FormControl('');
  filterId = new FormControl('');

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private financialService: FinancialService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadBoletos();
    this.filterNome.valueChanges.subscribe(() => this.applyFilter());
    this.filterStatus.valueChanges.subscribe(() => this.applyFilter());
    this.filterGlobal.valueChanges.subscribe(() => this.applyFilter());
    this.filterId.valueChanges.subscribe(() => this.applyFilter());
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: Boleto, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      const id = data.id.toString();
      const nome = data.associado?.nome || '';
      const status = data.status || '';
      const valor = data.valor?.toString() || '';
      
      let vencimento = '';
      if (data.vencimento && !isNaN(new Date(data.vencimento).getTime())) {
          vencimento = new Date(data.vencimento).toLocaleDateString('pt-BR');
      }

      const globalFilter = (searchTerms.global || '').toLowerCase();
      
      const matchGlobal = [
        id,
        nome,
        status,
        valor,
        vencimento
      ].some(field => field.toLowerCase().includes(globalFilter));

      const matchId = searchTerms.id ? id.includes(searchTerms.id) : true;
      const matchNome = nome.toLowerCase().includes((searchTerms.nome || '').toLowerCase());
      const matchStatus = searchTerms.status ? status.toLowerCase() === searchTerms.status.toLowerCase() : true;
      
      return matchId && matchNome && matchStatus && matchGlobal;
    };
  }

  loadBoletos(): void {
    this.financialService.getBoletos().subscribe((data: any[]) => {
      const boletosComDataCorrigida = data.map(boleto => {
        return {
          ...boleto,
          vencimento: new Date(boleto.vencimento)
        };
      });
      this.dataSource.data = boletosComDataCorrigida;
    });
  }

  applyFilter() {
    const filterValues = {
      id: this.filterId.value || '',
      nome: (this.filterNome.value || '').toLowerCase(),
      status: this.filterStatus.value || '',
      global: (this.filterGlobal.value || '').toLowerCase()
    };
    this.dataSource.filter = JSON.stringify(filterValues);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  navigateToGenerateBoleto(): void {
    this.router.navigate(['/generate-boleto']);
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
  
  formatStatus(status: string): string {
    if (!status) {
        return '';
    }
    const formatted = status.replace(/([A-Z])/g, ' $1').trim();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  // MÉTODO ATUALIZADO PARA ACEITAR O SEGUNDO ARGUMENTO (event)
  cancelarBoleto(boleto: Boleto, event: MouseEvent): void {
    event.stopPropagation(); // Impede que o clique se propague para a linha da tabela

    const motivo = prompt('Por favor, insira o motivo do cancelamento:');
    if (motivo && motivo.trim().length > 5) {
      this.financialService.solicitarCancelamento(boleto.id, motivo).subscribe({
        next: () => {
          this.snackBar.open('Solicitação de cancelamento enviada com sucesso!', 'Fechar', { duration: 3000 });
          this.loadBoletos();
        },
        error: (err) => {
          this.snackBar.open('Erro ao solicitar o cancelamento.', 'Fechar', { duration: 3000 });
        }
      });
    } else if (motivo !== null) {
      this.snackBar.open('O motivo do cancelamento é obrigatório e deve ter mais de 5 caracteres.', 'Fechar', { duration: 4000 });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.financialService.importarRetorno(file).subscribe({
        next: () => {
          this.snackBar.open('Arquivo de retorno importado e processado com sucesso!', 'Fechar', { duration: 3000 });
          this.loadBoletos();
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Erro ao importar o arquivo de retorno.';
          this.snackBar.open(errorMessage, 'Fechar', { duration: 5000 });
        }
      });
      input.value = '';
    }
  }
  
  viewHistory(boleto: Boleto): void {
    this.router.navigate(['/payment-history', boleto.associadoId]);
  }
}