import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';

interface Dependente {
  nome: string;
  nomeAssociado: string;
  situacao: 'Regular' | 'Desligado' | 'Inadimplente';
}

const DEPENDENTES_DATA: Dependente[] = [
  { nome: 'Lucas Tanaka', nomeAssociado: 'Andressa Akemi Tanaka', situacao: 'Regular' },
  { nome: 'Marina Sato', nomeAssociado: 'Ana Beatriz Takahashi', situacao: 'Regular' },
  { nome: 'Pedro Souza', nomeAssociado: 'André Francisco de Souza', situacao: 'Desligado' },
  { nome: 'Carolina Lima', nomeAssociado: 'Carlos Eduardo Lima', situacao: 'Regular' },
  { nome: 'Matheus Matsuda', nomeAssociado: 'Juliana Matsuda', situacao: 'Inadimplente' },
  { nome: 'Fernanda Honda', nomeAssociado: 'Gabriel Honda', situacao: 'Regular' },
  { nome: 'Bruno Uehara', nomeAssociado: 'Beatriz Uehara', situacao: 'Regular' },
  { nome: 'Vanessa Okada', nomeAssociado: 'Vinícius Okada', situacao: 'Regular' },
  { nome: 'Igor Nishimura Jr.', nomeAssociado: 'Igor Nishimura', situacao: 'Regular' },
  { nome: 'Camila Kobayashi', nomeAssociado: 'Larissa Kobayashi', situacao: 'Desligado' },
  { nome: 'Rafael Takahashi', nomeAssociado: 'Ana Beatriz Takahashi', situacao: 'Regular' },
  { nome: 'Beatriz Fukuda', nomeAssociado: 'Patrícia Shimizu', situacao: 'Regular' },
  { nome: 'Daniel Sasaki Filho', nomeAssociado: 'Daniel Sasaki', situacao: 'Regular' },
  { nome: 'Luana Morimoto', nomeAssociado: 'Ricardo Morimoto', situacao: 'Regular' },
  { nome: 'Gustavo Iwasaki', nomeAssociado: 'Tiago Iwasaki', situacao: 'Inadimplente' },
  { nome: 'Renata Fujita', nomeAssociado: 'Rodrigo Fujita', situacao: 'Inadimplente' },
  { nome: 'Tatiane Kamikawa', nomeAssociado: 'Érika Kamikawa', situacao: 'Regular' },
  { nome: 'Marcelo Hasegawa', nomeAssociado: 'Eduardo Hasegawa', situacao: 'Desligado' },
  { nome: 'Elaine Nishikawa', nomeAssociado: 'Elaine Nishikawa', situacao: 'Regular' },
  { nome: 'Amanda Yamamoto', nomeAssociado: 'Fernanda Yamamoto', situacao: 'Regular' },
  { nome: 'Julio Nakamura', nomeAssociado: 'João Pedro Nakagawa', situacao: 'Regular' },
  { nome: 'Larissa Arakaki', nomeAssociado: 'Letícia Arakaki', situacao: 'Inadimplente' },
  { nome: 'Paula Matsumoto', nomeAssociado: 'Paula Matsumoto', situacao: 'Desligado' },
  { nome: 'Ricardo Shibata', nomeAssociado: 'Amanda Shibata', situacao: 'Regular' },
  { nome: 'Sofia Nishida', nomeAssociado: 'Lucas Nishida', situacao: 'Regular' },
  { nome: 'Felipe Kanashiro Jr.', nomeAssociado: 'Felipe Taniguchi', situacao: 'Regular' },
  { nome: 'Tatiane Ueno', nomeAssociado: 'Vanessa Ueno', situacao: 'Regular' },
  { nome: 'Renato Sasaki', nomeAssociado: 'Daniel Sasaki', situacao: 'Regular' },
  { nome: 'Mariana Yamaguchi', nomeAssociado: 'Gustavo Yamaguchi', situacao: 'Regular' },
  { nome: 'Camila Okamoto', nomeAssociado: 'Mariana Okamoto', situacao: 'Regular' },
  { nome: 'Tiago Nishikawa', nomeAssociado: 'Elaine Nishikawa', situacao: 'Regular' },
  { nome: 'Vanessa Fujita', nomeAssociado: 'Rodrigo Fujita', situacao: 'Inadimplente' },
  { nome: 'Pedro Kamikawa', nomeAssociado: 'Érika Kamikawa', situacao: 'Regular' },
  { nome: 'Larissa Takemoto', nomeAssociado: 'Henrique Takemoto', situacao: 'Desligado' },
  { nome: 'Gustavo Yamamoto', nomeAssociado: 'Fernanda Yamamoto', situacao: 'Regular' },
  { nome: 'Andressa Nishimura', nomeAssociado: 'Igor Nishimura', situacao: 'Regular' },
  { nome: 'Marina Sato Filho', nomeAssociado: 'Marina Sato', situacao: 'Regular' },
  { nome: 'Carlos Tanaka', nomeAssociado: 'Andressa Akemi Tanaka', situacao: 'Regular' },
  { nome: 'Beatriz Miyazaki', nomeAssociado: 'Tatiane Miyazaki', situacao: 'Regular' },
  { nome: 'Daniel Kuniyoshi', nomeAssociado: 'Diego Kuniyoshi', situacao: 'Regular' },
  { nome: 'Juliana Arakaki', nomeAssociado: 'Letícia Arakaki', situacao: 'Regular' },
  { nome: 'Bruno Shimizu', nomeAssociado: 'Patrícia Shimizu', situacao: 'Regular' },
  { nome: 'Simone Matsuda', nomeAssociado: 'Juliana Matsuda', situacao: 'Inadimplente' }
];

@Component({
  selector: 'app-list-dependents',
  templateUrl: './list-dependents.component.html',
  styleUrls: ['./list-dependents.component.scss']
})
export class ListDependentsComponent implements AfterViewInit {
  displayedColumns = ['nome', 'nomeAssociado', 'situacao'];
  dataSource = new MatTableDataSource<Dependente>(DEPENDENTES_DATA);

  filterNome = new FormControl('');
  filterSituacao = new FormControl('');
  filterGlobal = new FormControl('');

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.dataSource.filterPredicate = (data, filter) => {
      const { nome, nomeAssociado, situacao } = data;
      const search = JSON.parse(filter) as any;
      const mNome = nome.toLowerCase().includes(search.nome);
      const mNomeAssoc = nomeAssociado.toLowerCase().includes(search.nome);
      const mSituacao = search.situacao ? situacao === search.situacao : true;
      const mGlobal = (nome.toLowerCase().includes(search.global)
        || nomeAssociado.toLowerCase().includes(search.global)
        || situacao.toLowerCase().includes(search.global));
      return mNome && mSituacao && mGlobal;
    };

    this.filterNome.valueChanges.subscribe(() => this.applyFilter());
    this.filterSituacao.valueChanges.subscribe(() => this.applyFilter());
    this.filterGlobal.valueChanges.subscribe(() => this.applyFilter());
  }

  applyFilter() {
    const vals = {
      nome: (this.filterNome.value || '').toLowerCase(),
      situacao: this.filterSituacao.value || '',
      global: (this.filterGlobal.value || '').toLowerCase()
    };
    this.dataSource.filter = JSON.stringify(vals);
    if (this.paginator) this.paginator.firstPage();
  }
}
