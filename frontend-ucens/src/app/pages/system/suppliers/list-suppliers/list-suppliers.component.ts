import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

// Serviços e Interfaces locais
import { Fornecedor } from '../../../../services/suppliers/supplier.interface';
import { SupplierService } from '../../../../services/suppliers/supplier.service';

@Component({
  selector: 'app-list-suppliers',
  templateUrl: './list-suppliers.component.html',
  styleUrls: ['./list-suppliers.component.scss']
})
export class ListSuppliersComponent implements AfterViewInit, OnInit {
  // Colunas ajustadas para fornecedor, sem 'acoes'
  displayedColumns = ['nome', 'responsavel', 'email', 'status'];
  dataSource = new MatTableDataSource<Fornecedor>([]);

  // Controles de Filtro idênticos ao exemplo
  filterNome = new FormControl('');
  filterStatus = new FormControl('');
  filterGlobal = new FormControl('');

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private supplierService: SupplierService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Carregamento simplificado, pois não precisa de forkJoin
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.dataSource.data = suppliers;
      },
      error: (err) => {
        this.snackBar.open('Falha ao carregar a lista de fornecedores.', 'Fechar', { duration: 3000 });
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // Predicado de filtro adaptado para as propriedades de Fornecedor
    this.dataSource.filterPredicate = (data, filter) => {
      const search = JSON.parse(filter) as any;

      // Filtro específico para nome/responsável/email
      const matchNome = (
        data.nome.toLowerCase().includes(search.nome) ||
        data.responsavel.toLowerCase().includes(search.nome) ||
        data.email.toLowerCase().includes(search.nome)
      );

      // Filtro específico para status
      const matchStatus = search.status ? (data.ativo ? 'ativo' : 'inativo') === search.status : true;

      // Filtro global
      const matchGlobal = (
        data.nome.toLowerCase().includes(search.global) ||
        data.responsavel.toLowerCase().includes(search.global) ||
        data.email.toLowerCase().includes(search.global)
      );

      return matchNome && matchStatus && matchGlobal;
    };

    // Assina as mudanças nos campos de filtro
    this.filterNome.valueChanges.subscribe(() => this.applyFilter());
    this.filterStatus.valueChanges.subscribe(() => this.applyFilter());
    this.filterGlobal.valueChanges.subscribe(() => this.applyFilter());
  }

  applyFilter() {
    const vals = {
      nome: (this.filterNome.value || '').toLowerCase(),
      status: (this.filterStatus.value || '').toLowerCase(),
      global: (this.filterGlobal.value || '').toLowerCase()
    };
    this.dataSource.filter = JSON.stringify(vals);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}