import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

// Importando o serviço e a interface para comunicar com o backend
import { AssociateService } from 'src/app/services/associates/associate.service';
import { Associate } from 'src/app/services/associates/associate.interface';

@Component({
  selector: 'app-list-associates',
  templateUrl: './list-associates.component.html',
  styleUrls: ['./list-associates.component.scss']
})
export class ListAssociatesComponent implements AfterViewInit, OnInit {
  displayedColumns = ['nome', 'cognome', 'situacao'];
  // A tabela agora começa vazia e será preenchida com os dados do backend
  dataSource = new MatTableDataSource<Associate>([]);

  // Seus filtros personalizados permanecem inalterados
  filterNome = new FormControl('');
  filterSituacao = new FormControl('');
  filterGlobal = new FormControl('');

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Injetando o serviço de associados para buscar os dados
  constructor(private associateService: AssociateService) {}

  ngOnInit(): void {
    // Assim que o componente inicia, buscamos os associados
    this.loadAssociates();
  }

  /**
   * Busca os dados dos associados no backend e preenche a tabela.
   */
  loadAssociates(): void {
    this.associateService.getAssociados().subscribe({
      next: (associados) => {
        this.dataSource.data = associados;
      },
      error: (err) => {
        console.error('Ocorreu um erro ao buscar os associados:', err);
        // Aqui você pode adicionar um feedback visual para o usuário, como um toast ou snackbar.
      }
    });
  }

  ngAfterViewInit() {
    // A configuração do paginador e da ordenação continua a mesma
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // Sua função de filtro personalizada continua exatamente a mesma
    this.dataSource.filterPredicate = (data, filter) => {
      const { nome, cognome, situacao } = data;
      const searchTerms = JSON.parse(filter) as any;
      const matchNome = nome.toLowerCase().includes(searchTerms.nome);
      const matchSituacao = searchTerms.situacao ? situacao === searchTerms.situacao : true;
      const matchGlobal =
        nome.toLowerCase().includes(searchTerms.global) ||
        cognome.toLowerCase().includes(searchTerms.global) ||
        situacao.toLowerCase().includes(searchTerms.global);
      return matchNome && matchSituacao && matchGlobal;
    };

    // A lógica de aplicação dos filtros também permanece inalterada
    this.filterNome.valueChanges.subscribe(() => this.applyFilter());
    this.filterSituacao.valueChanges.subscribe(() => this.applyFilter());
    this.filterGlobal.valueChanges.subscribe(() => this.applyFilter());
  }

  applyFilter() {
    const filterValues = {
      nome: (this.filterNome.value || '').toLowerCase(),
      situacao: this.filterSituacao.value || '',
      global: (this.filterGlobal.value || '').toLowerCase()
    };
    this.dataSource.filter = JSON.stringify(filterValues);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
