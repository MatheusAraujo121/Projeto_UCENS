import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

// Serviços e Interfaces
import { Fornecedor, Despesa } from '../../../../services/suppliers/supplier.interface';
import { SupplierService } from '../../../../services/suppliers/supplier.service';

@Component({
  selector: 'app-view-supplier',
  templateUrl: './view-suppliers.component.html',
  styleUrls: ['./view-suppliers.component.scss']
})
export class ViewSuppliersComponent implements OnInit, AfterViewInit {

  supplier: Fornecedor | null = null;
  public supplierIds: number[] = [];
  public currentIndex = 0;
  isLoading = true;

  despesasDataSource = new MatTableDataSource<Despesa>([]);
  displayedColumns: string[] = ['id', 'descricao', 'valor', 'dataVencimento', 'status'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private supplierService: SupplierService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const id = +idParam;
        // Carrega todos os IDs e depois busca o fornecedor atual
        this.loadAllIdsAndSetCurrent(id);
      }
    });
  }

  ngAfterViewInit() {
    this.despesasDataSource.sort = this.sort;
    this.despesasDataSource.paginator = this.paginator;
  }

  private loadAllIdsAndSetCurrent(currentId: number): void {
    // Usando o novo método no serviço
    this.supplierService.getSupplierIds().subscribe(ids => {
      this.supplierIds = ids;
      this.currentIndex = this.supplierIds.findIndex(id => id === currentId);
      this.loadSupplier(currentId);
    });
  }

  private loadSupplier(id: number): void {
    this.isLoading = true;
    this.supplierService.getSupplierById(id).subscribe({
      next: (data) => {
        this.supplier = data;
        // As despesas já vêm com o fornecedor, então só precisamos atribuí-las
        this.despesasDataSource.data = data.despesas || [];
        this.despesasDataSource.paginator = this.paginator; // Reatribui o paginador
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Erro ao carregar o fornecedor.', 'Fechar', { duration: 3000 });
        this.router.navigate(['list-suppliers']);
        this.isLoading = false;
      }
    });
  }

  // Funções de formatação de status para a tabela de despesas
  formatStatus(status: string): string {
    if (!status) return 'N/A';
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'paga': return 'status-paid';
      case 'pendente': return 'status-pending';
      case 'atrasada': return 'status-overdue';
      case 'cancelada': return 'status-cancelled';
      default: return 'status-default';
    }
  }

  anterior() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      const prevId = this.supplierIds[this.currentIndex];
      this.router.navigate(['/view-suppliers', prevId]);
    }
  }

  proximo() {
    if (this.currentIndex < this.supplierIds.length - 1) {
      this.currentIndex++;
      const nextId = this.supplierIds[this.currentIndex];
      this.router.navigate(['/view-suppliers', nextId]);
    }
  }

  excluir() {
    if (this.supplier) {
      if (confirm(`Tem certeza que deseja excluir o fornecedor ${this.supplier.nome}?`)) {
        this.supplierService.deleteSupplier(this.supplier.id).subscribe({
          next: () => {
            this.snackBar.open('Fornecedor excluído com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigate(['/list-suppliers']);
          },
          error: (err) => {
            this.snackBar.open('Erro ao excluir fornecedor!', 'Fechar', { duration: 3000 });
          }
        });
      }
    }
  }
}