import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FinancialService } from '../../../../services/financial/financial.service';
import { Boleto } from '../../../../services/financial/boleto.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
// 1. IMPORTAR O MatDialog
import { MatDialog } from '@angular/material/dialog';
// 2. IMPORTAR O COMPONENTE DO MODAL
// ATENÇÃO: Verifique se este caminho está correto!
import { PendingPaymentCancellationModalComponent } from '../pending-payment-cancellation-modal/pending-payment-cancellation-modal.component'; 

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
    private snackBar: MatSnackBar,
    // 3. INJETAR O MatDialog
    public dialog: MatDialog 
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
      // MELHORIA: Verificando se 'data.vencimento' é um objeto Date válido
      if (data.vencimento && data.vencimento instanceof Date && !isNaN(data.vencimento.getTime())) {
          vencimento = data.vencimento.toLocaleDateString('pt-BR');
      }

      const globalFilter = (searchTerms.global || '').toLowerCase();
      
      const matchGlobal = [
        id,
        nome,
        status,
        valor,
        vencimento
      ].filter(field => field != null) // Remove nulos ou undefined
       .map(field => String(field)) // Garante que é string
       .some(field => field.toLowerCase().includes(globalFilter));

      const matchId = searchTerms.id ? id.includes(searchTerms.id) : true;
      const matchNome = nome.toLowerCase().includes((searchTerms.nome || '').toLowerCase());
      const matchStatus = searchTerms.status ? status.toLowerCase() === searchTerms.status.toLowerCase() : true;
      
      return matchId && matchNome && matchStatus && matchGlobal;
    };
  }

  loadBoletos(): void {
    // CORREÇÃO: Mudei 'any[]' para 'Boleto[]' para manter a tipagem forte.
    this.financialService.getBoletos().subscribe({
        next: (data: Boleto[]) => {
            const boletosComDataCorrigida = data.map(boleto => {
                return {
                    ...boleto,
                    // CORREÇÃO: Se 'vencimento' puder vir nulo, isso evita datas inválidas (ex: 1970)
                    // (Lembre-se de ajustar a interface Boleto para 'vencimento: Date | null;')
                    vencimento: new Date(boleto.vencimento)
                };
            });
            this.dataSource.data = boletosComDataCorrigida;

            // 4. CHAMAR A FUNÇÃO DE VERIFICAÇÃO DO MODAL
            this.checkAndOpenPendingCancellationModal(boletosComDataCorrigida);
        },
        error: (err) => {
             // Tenta extrair uma mensagem de erro mais útil
             const errorMsg = err.error?.message || err.message || 'Erro ao carregar boletos.';
             this.snackBar.open(`Erro: ${errorMsg}`, 'Fechar', { duration: 5000 });
        }
    });
  }

  /**
   * 5. ADICIONAR A FUNÇÃO QUE VERIFICA E ABRE O MODAL
   * Verifica se existem boletos com cancelamento solicitado e abre o modal.
   * @param boletos Lista completa de boletos carregada.
   */
  checkAndOpenPendingCancellationModal(boletos: Boleto[]): void {
    // Filtra os boletos com o status específico 'CancelamentoSolicitado'
    const pendingBoletos = boletos.filter(
      b => b.status === 'CancelamentoSolicitado' // Este é o status que indica pendência
    );

    // Se encontrou algum boleto pendente
    if (pendingBoletos.length > 0) {
      // Verifica se um modal deste tipo já está aberto para evitar duplicidade
      const isModalOpen = this.dialog.openDialogs.some(dialog => 
        dialog.componentInstance instanceof PendingPaymentCancellationModalComponent
      );

      if (!isModalOpen) {
        console.log("Abrindo modal para cancelamentos pendentes:", pendingBoletos);
        // Abre o modal passando a lista de boletos pendentes como dados
        this.dialog.open(PendingPaymentCancellationModalComponent, {
          width: '700px', // Ou outra largura desejada
          data: { boletos: pendingBoletos } // Passa a lista filtrada para o modal
        });
      } 

      // Alerta adicional (opcional, mas útil)
      this.snackBar.open(
        `Atenção: Existem ${pendingBoletos.length} boleto(s) com cancelamento pendente de envio!`, 
        'Fechar', 
        {
          duration: 7000,
          panelClass: ['snackbar-warning'] // Adicione um estilo CSS para 'snackbar-warning'
        }
      );
    } else {
      console.log("Nenhum boleto com cancelamento pendente encontrado.");
    }
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

  // MELHORIA: Deixei seu getStatusClass mais robusto (combinando os dois códigos)
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
    // Lógica para adicionar espaço antes de letras maiúsculas
    let formatted = status.replace(/([A-Z])/g, ' $1').trim();
    // Capitaliza apenas a primeira letra da string inteira
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
    // Casos especiais
    formatted = formatted.replace('Pago com atraso', 'Pago com Atraso');
    formatted = formatted.replace('Cancelamento solicitado', 'Cancelamento Solicitado');
    return formatted;
  }

  cancelarBoleto(boleto: Boleto, event: MouseEvent): void {
    event.stopPropagation(); 

    const motivo = prompt('Por favor, insira o motivo do cancelamento:');
    if (motivo && motivo.trim().length > 5) { // Adicionado .trim()
      // Usando 'motivo.trim()' para garantir que não envie só espaços
      this.financialService.solicitarCancelamento(boleto.id, motivo.trim()).subscribe({
        next: () => {
          this.snackBar.open('Solicitação de cancelamento enviada com sucesso!', 'Fechar', { duration: 3000 });
          this.loadBoletos(); // Recarrega os boletos (e vai re-verificar o modal)
        },
        error: (err) => {
          // Mensagem de erro mais detalhada
          const errMsg = typeof err.error === 'string' ? err.error : err.message || 'Erro ao solicitar o cancelamento.';
          this.snackBar.open(`Erro: ${errMsg}`, 'Fechar', { duration: 5000 });
        }
      });
    } else if (motivo !== null) { // Só mostra erro se o usuário não clicou em "Cancelar"
      this.snackBar.open('O motivo do cancelamento é obrigatório e deve ter mais de 5 caracteres.', 'Fechar', { duration: 4000 });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.financialService.importarRetorno(file).subscribe({
        // MELHORIA: Usando a mensagem de sucesso da API, se ela existir
        next: (response: any) => { 
          // A API pode retornar uma string simples ou um objeto { message: '...' }
          const message = (typeof response === 'string' ? response : response?.message) || 'Arquivo de retorno importado e processado!';
          this.snackBar.open(message, 'Fechar', { duration: 5000 });
          this.loadBoletos(); // Recarrega os boletos (e vai re-verificar o modal)
        },
        error: (err) => {
          // Tenta pegar a mensagem de erro da resposta da API
           const errorMessage = (err.error && typeof err.error === 'string') ? err.error : (err.error?.message || err.message || 'Erro ao importar o arquivo de retorno.');
          this.snackBar.open(`Erro: ${errorMessage}`, 'Fechar', { duration: 7000 });
        }
      });
      input.value = '';
    }
  }
  
  viewHistory(boleto: Boleto): void {
     if (boleto.associadoId) {
        this.router.navigate(['/payment-history', boleto.associadoId]);
     } else {
        this.snackBar.open('ID do associado não encontrado para este boleto.', 'Fechar', { duration: 3000 });
     }
  }
}