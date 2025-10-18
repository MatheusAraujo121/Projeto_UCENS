import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ExpensesService } from '../../../../services/expenses/expenses.service';
import { Despesa } from '../../../../services/expenses/expenses.interface';
import { SupplierService } from '../../../../services/suppliers/supplier.service';
import { Fornecedor } from '../../../../services/suppliers/supplier.interface';
import { ExpenseDetailComponent } from '../expense-detail/expense-detail.component'; // Importe o novo modal

@Component({
  selector: 'app-expenses-dashboard',
  templateUrl: './expenses-dashboard.component.html',
  styleUrls: ['./expenses-dashboard.component.scss']
})
export class ExpensesDashboardComponent implements OnInit, AfterViewInit {
  // Removida a coluna 'acoes'
  displayedColumns: string[] = ['id', 'descricao', 'categoria', 'valor', 'dataVencimento', 'status'];
  dataSource = new MatTableDataSource<Despesa>([]);

  // Removido o filtro de descrição
  filterCategoria = new FormControl('');
  filterStatus = new FormControl('');
  filterGlobal = new FormControl('');
  filterId = new FormControl('');

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private expensesService: ExpensesService,
    private supplierService: SupplierService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog // Injete MatDialog
  ) { }

  ngOnInit(): void {
    this.loadExpenses();
    this.filterCategoria.valueChanges.subscribe(() => this.applyFilter());
    this.filterStatus.valueChanges.subscribe(() => this.applyFilter());
    this.filterGlobal.valueChanges.subscribe(() => this.applyFilter());
    this.filterId.valueChanges.subscribe(() => this.applyFilter());
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: Despesa, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);

      const id = data.id.toString();
      const descricao = data.descricao || '';
      const categoria = data.categoria || '';
      const status = data.status || '';
      const valor = data.valor?.toString() || '';
      let vencimento = '';
      if (data.dataVencimento && !isNaN(new Date(data.dataVencimento).getTime())) {
          vencimento = new Date(data.dataVencimento).toLocaleDateString('pt-BR');
      }

      const globalFilter = (searchTerms.global || '').toLowerCase();
      
      // A descrição agora é verificada apenas no filtro global
      const matchGlobal = [id, descricao, categoria, status, valor, vencimento]
        .some(field => field.toLowerCase().includes(globalFilter));

      const matchId = searchTerms.id ? id.includes(searchTerms.id) : true;
      const matchCategoria = categoria.toLowerCase().includes((searchTerms.categoria || '').toLowerCase());
      const matchStatus = searchTerms.status ? status.toLowerCase() === searchTerms.status.toLowerCase() : true;

      return matchGlobal && matchId && matchCategoria && matchStatus;
    };
  }

  loadExpenses(): void {
    this.supplierService.getSuppliers().subscribe((data: Fornecedor[]) => {
      const allExpenses = data.flatMap(supplier => supplier.despesas || []);
      this.dataSource.data = allExpenses.map(d => ({
        ...d,
        dataVencimento: new Date(d.dataVencimento)
      }));
    });
  }

  applyFilter() {
    const filterValues = {
      id: this.filterId.value || '',
      categoria: (this.filterCategoria.value || '').toLowerCase(),
      status: this.filterStatus.value || '',
      global: (this.filterGlobal.value || '').toLowerCase()
    };
    this.dataSource.filter = JSON.stringify(filterValues);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  /**
   * Abre o modal com os detalhes da despesa.
   * @param expense A despesa clicada na linha.
   */
  openExpenseDetails(expense: Despesa): void {
    const dialogRef = this.dialog.open(ExpenseDetailComponent, {
      width: '700px',
      data: expense 
    });

    // Ouve o resultado do fechamento do modal
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.confirmDelete(expense);
      }
    });
  }

  /**
   * Confirma e executa a exclusão da despesa.
   * @param expense A despesa a ser excluída.
   */
  confirmDelete(expense: Despesa): void {
     if (confirm(`Tem certeza que deseja excluir a despesa "${expense.descricao}"?`)) {
      this.expensesService.deleteExpense(expense.id).subscribe({
        next: () => {
          this.snackBar.open('Despesa excluída com sucesso!', 'Fechar', { duration: 3000 });
          this.loadExpenses();
        },
        error: () => {
          this.snackBar.open('Erro ao excluir a despesa.', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  navigateToCreateExpense(): void {
    this.router.navigate(['/create-expense']);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Paga': return 'status-paid';
      case 'Pago com atraso': return 'status-paid-late'; // NOVO
      case 'Pendente': return 'status-pending';
      case 'Atrasada': return 'status-overdue';
      case 'Cancelada': return 'status-cancelled';
      default: return 'status-default';
    }
  }

  formatStatus(status: string): string {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}