import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { DependentService } from 'src/app/services/dependents/dependent.service';
import { Dependent } from 'src/app/services/dependents/dependent.interface';
import { AssociateService } from 'src/app/services/associates/associate.service';
import { Associate } from 'src/app/services/associates/associate.interface';

interface DependenteDisplay {
  id: number;
  nome: string;
  nomeAssociado: string;
  parentesco?: string;
}

@Component({
  selector: 'app-list-dependents',
  templateUrl: './list-dependents.component.html',
  styleUrls: ['./list-dependents.component.scss']
})
export class ListDependentsComponent implements AfterViewInit, OnInit {
  // Colunas da tabela atualizadas para exibir parentesco
  displayedColumns = ['nome', 'nomeAssociado', 'parentesco'];
  dataSource = new MatTableDataSource<DependenteDisplay>([]);

  // Filtros mantidos (o filtro de situação agora filtrará o parentesco)
  filterNome = new FormControl('');
  filterParentesco = new FormControl(''); // Renomeado para clareza
  filterGlobal = new FormControl('');

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dependentService: DependentService,
    private associateService: AssociateService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Busca os dados de dependentes e associados da API, combina as informações
   * e preenche a tabela.
   */
  loadData(): void {
    forkJoin({
      dependents: this.dependentService.getDependents(),
      associates: this.associateService.getAssociados()
    }).subscribe({
      next: ({ dependents, associates }) => {
        const associatesMap = new Map<number, Associate>(
          associates.map(assoc => [assoc.id, assoc])
        );

        const displayData: DependenteDisplay[] = dependents.map(dep => {
          const associado = associatesMap.get(dep.associadoId);
          return {
            id: dep.id,
            nome: dep.nome,
            nomeAssociado: associado ? associado.nome : 'Não encontrado',
            // Mapeia o grauParentesco do backend para a propriedade parentesco
            parentesco: dep.grauParentesco
          };
        });

        this.dataSource.data = displayData;
      },
      error: (err) => {
        console.error('Erro ao carregar dados:', err);
        alert('Falha ao carregar a lista de dependentes.');
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // Função de filtro adaptada para a propriedade 'parentesco'
    this.dataSource.filterPredicate = (data, filter) => {
      const { nome, nomeAssociado, parentesco } = data;
      const search = JSON.parse(filter) as any;
      const safeParentesco = parentesco || ''; // Garante que não seja undefined

      const mNome = nome.toLowerCase().includes(search.nome) || nomeAssociado.toLowerCase().includes(search.nome);
      const mParentesco = search.parentesco ? safeParentesco.toLowerCase() === search.parentesco : true;
      const mGlobal = (nome.toLowerCase().includes(search.global)
        || nomeAssociado.toLowerCase().includes(search.global)
        || safeParentesco.toLowerCase().includes(search.global));
      return mNome && mParentesco && mGlobal;
    };

    this.filterNome.valueChanges.subscribe(() => this.applyFilter());
    this.filterParentesco.valueChanges.subscribe(() => this.applyFilter());
    this.filterGlobal.valueChanges.subscribe(() => this.applyFilter());
  }

  // Função de aplicar filtro adaptada para a propriedade 'parentesco'
  applyFilter() {
    const vals = {
      nome: (this.filterNome.value || '').toLowerCase(),
      parentesco: (this.filterParentesco.value || '').toLowerCase(),
      global: (this.filterGlobal.value || '').toLowerCase()
    };
    this.dataSource.filter = JSON.stringify(vals);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
