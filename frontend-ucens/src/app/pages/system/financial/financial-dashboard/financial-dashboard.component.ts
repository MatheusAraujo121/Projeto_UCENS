import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FinancialService } from '../../../../services/financial/financial.service';
import { Boleto } from '../../../../services/financial/boleto.interface';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importe o MatSnackBar

@Component({
  selector: 'app-financial-dashboard',
  templateUrl: './financial-dashboard.component.html',
  styleUrls: ['./financial-dashboard.component.scss']
})
export class FinancialDashboardComponent implements OnInit, AfterViewInit {
  // Adicionada a coluna 'acoes'
  displayedColumns: string[] = ['id', 'nome', 'valor', 'vencimento', 'status', 'acoes'];
  dataSource = new MatTableDataSource<Boleto>([]);

  filterNome = new FormControl('');
  filterStatus = new FormControl('');
  filterGlobal = new FormControl('');

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private financialService: FinancialService,
    private router: Router,
    private snackBar: MatSnackBar // Injete o MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadBoletos();
    this.filterNome.valueChanges.subscribe(() => this.applyFilter());
    this.filterStatus.valueChanges.subscribe(() => this.applyFilter());
    this.filterGlobal.valueChanges.subscribe(() => this.applyFilter());
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: Boleto, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      const nome = data.associado?.nome || '';
      const status = data.status || '';
      const valor = data.valor?.toString() || '';
      
      let vencimento = '';
      if (data.vencimento && !isNaN(new Date(data.vencimento).getTime())) {
          vencimento = new Date(data.vencimento).toLocaleDateString('pt-BR');
      }

      const globalFilter = (searchTerms.global || '').toLowerCase();
      
      const matchGlobal = [
        nome,
        status,
        valor,
        vencimento
      ].some(field => field.toLowerCase().includes(globalFilter));

      const matchNome = nome.toLowerCase().includes((searchTerms.nome || '').toLowerCase());
      // Ajuste para permitir múltiplos status
      const matchStatus = searchTerms.status ? status.toLowerCase() === searchTerms.status.toLowerCase() : true;
      
      return matchNome && matchStatus && matchGlobal;
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
      case 'CancelamentoSolicitado': return 'status-pendingcancelled'; // Reutilizando a cor de pendente
      default: return 'status-default';
    }
  }

  // NOVA FUNÇÃO PARA CANCELAR BOLETO
  cancelarBoleto(boleto: Boleto): void {
    const motivo = prompt('Por favor, insira o motivo do cancelamento:');
    if (motivo && motivo.trim().length > 5) {
      this.financialService.solicitarCancelamento(boleto.id, motivo).subscribe({
        next: () => {
          this.snackBar.open('Solicitação de cancelamento enviada com sucesso!', 'Fechar', { duration: 3000 });
          this.loadBoletos(); // Recarrega a lista para atualizar o status
        },
        error: (err) => {
          this.snackBar.open('Erro ao solicitar o cancelamento.', 'Fechar', { duration: 3000 });
        }
      });
    } else if (motivo !== null) { // Verifica se o usuário não clicou em 'Cancelar' no prompt
      this.snackBar.open('O motivo do cancelamento é obrigatório e deve ter mais de 5 caracteres.', 'Fechar', { duration: 4000 });
    }
  }

  // NOVA FUNÇÃO PARA IMPORTAR ARQUIVO DE RETORNO
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.financialService.importarRetorno(file).subscribe({
        next: () => {
          this.snackBar.open('Arquivo de retorno importado e processado com sucesso!', 'Fechar', { duration: 3000 });
          this.loadBoletos(); // Recarrega a lista para refletir os pagamentos
        },
        error: (err) => {
          this.snackBar.open('Erro ao importar o arquivo de retorno.', 'Fechar', { duration: 3000 });
        }
      });
      // Limpa o input para permitir selecionar o mesmo arquivo novamente
      input.value = '';
    }
  }
}