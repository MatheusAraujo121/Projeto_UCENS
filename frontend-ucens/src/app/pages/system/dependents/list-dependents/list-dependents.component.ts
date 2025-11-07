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
import { MatSnackBar } from '@angular/material/snack-bar';

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
  displayedColumns = ['nome', 'nomeAssociado', 'parentesco'];
  dataSource = new MatTableDataSource<DependenteDisplay>([]);
  filterNome = new FormControl('');
  filterParentesco = new FormControl(''); 
  filterGlobal = new FormControl('');

  // Propriedade para armazenar a lista dinâmica de parentescos
  grausParentesco: string[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dependentService: DependentService,
    private associateService: AssociateService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

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
            parentesco: dep.grauParentesco
          };
        });

        this.dataSource.data = displayData;

        // >>> LÓGICA DO FILTRO DINÂMICO ADICIONADA AQUI <<<
        // 1. Extrai todos os valores de 'grauParentesco' da lista de dependentes.
        const todosOsParentescos = dependents
          .map(dep => dep.grauParentesco)
          .filter((grau): grau is string => !!grau); // 2. Filtra para remover valores nulos ou vazios.

        // 3. Cria um conjunto de valores únicos para eliminar duplicatas e depois ordena em ordem alfabética.
        this.grausParentesco = [...new Set(todosOsParentescos)].sort();
      },
      error: (err) => {
        this.snackBar.open('Falha ao carregar a lista de dependentes.', 'Fechar', { duration: 3000 });
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data, filter) => {
      const { nome, nomeAssociado, parentesco } = data;
      const search = JSON.parse(filter) as any;
      const safeParentesco = parentesco || ''; 

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