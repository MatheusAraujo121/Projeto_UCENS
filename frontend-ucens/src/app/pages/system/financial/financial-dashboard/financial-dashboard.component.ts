import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FinancialService } from '../../../../services/financial/financial.service';
import { Boleto } from '../../../../services/financial/boleto.interface';

@Component({
  selector: 'app-financial-dashboard',
  templateUrl: './financial-dashboard.component.html',
  styleUrls: ['./financial-dashboard.component.scss']
})
export class FinancialDashboardComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nome', 'valor', 'vencimento', 'status'];
  dataSource = new MatTableDataSource<Boleto>([]);

  filterNome = new FormControl('');
  filterStatus = new FormControl('');
  filterGlobal = new FormControl('');

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private financialService: FinancialService,
    private router: Router
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
      
      // A data já é um objeto Date, então podemos formatá-la com segurança
      let vencimento = '';
      if (data.vencimento && !isNaN(data.vencimento.getTime())) {
          vencimento = data.vencimento.toLocaleDateString('pt-BR');
      }

      const globalFilter = (searchTerms.global || '').toLowerCase();
      
      const matchGlobal = [
        nome,
        status,
        valor,
        vencimento
      ].some(field => field.toLowerCase().includes(globalFilter));

      const matchNome = nome.toLowerCase().includes((searchTerms.nome || '').toLowerCase());
      const matchStatus = searchTerms.status ? status === searchTerms.status : true;
      
      return matchNome && matchStatus && matchGlobal;
    };
  }

  // MÉTODO ATUALIZADO PARA CONVERTER A DATA
  loadBoletos(): void {
    // Usamos <any[]> para receber os dados, pois a data ainda virá como string
    this.financialService.getBoletos().subscribe((data: any[]) => {
      
      // Mapeamos cada boleto e convertemos a string da data para um objeto Date
      const boletosComDataCorrigida = data.map(boleto => {
        return {
          ...boleto,
          vencimento: new Date(boleto.vencimento)
        };
      });
      
      // Populamos a tabela com os dados já convertidos
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
    this.router.navigate(['/system/finantial/generate-boleto']);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pago': return 'status-paid';
      case 'Pendente': return 'status-pending';
      case 'Cancelado': return 'status-cancelled';
      default: return 'status-default';
    }
  }
}