import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';

//essa parte até o components é somente para teste, pois isso ficara no backend
//e não no frontend, mas é necessário para o funcionamento do componente
//depois de implementado o backend, essa parte deve ser removida
//e o componente deve ser adaptado para receber os dados do backend

interface Associado {
  nome: string;
  cognome: string;
  situacao: 'Regular' | 'Desligado' | 'Inadimplente';
}

const EXAMPLE_DATA: Associado[] = [
  { nome: 'Andressa Akemi Tanaka', cognome: 'Tanaka', situacao: 'Regular' },
  { nome: 'Ana Beatriz Takahashi', cognome: 'Takahashi', situacao: 'Regular' },
  { nome: 'André Francisco de Souza', cognome: 'Souza', situacao: 'Desligado' },
  { nome: 'Carlos Eduardo Lima', cognome: 'Lima', situacao: 'Regular' },
  { nome: 'Juliana Matsuda', cognome: 'Matsuda', situacao: 'Inadimplente' },
  { nome: 'Fernanda Yamamoto', cognome: 'Yamamoto', situacao: 'Regular' },
  { nome: 'Felipe Taniguchi', cognome: 'Taniguchi', situacao: 'Regular' },
  { nome: 'João Pedro Nakagawa', cognome: 'Nakagawa', situacao: 'Regular' },
  { nome: 'Camila Sato', cognome: 'Sato', situacao: 'Regular' },
  { nome: 'Larissa Kobayashi', cognome: 'Kobayashi', situacao: 'Desligado' },
  { nome: 'Gabriel Honda', cognome: 'Honda', situacao: 'Regular' },
  { nome: 'Patrícia Shimizu', cognome: 'Shimizu', situacao: 'Regular' },
  { nome: 'Rodrigo Fujita', cognome: 'Fujita', situacao: 'Inadimplente' },
  { nome: 'Beatriz Uehara', cognome: 'Uehara', situacao: 'Regular' },
  { nome: 'Daniel Sasaki', cognome: 'Sasaki', situacao: 'Regular' },
  { nome: 'Eduardo Hasegawa', cognome: 'Hasegawa', situacao: 'Desligado' },
  { nome: 'Natália Kitano', cognome: 'Kitano', situacao: 'Regular' },
  { nome: 'Bruno Kanashiro', cognome: 'Kanashiro', situacao: 'Regular' },
  { nome: 'Luana Oshima', cognome: 'Oshima', situacao: 'Desligado' },
  { nome: 'Ricardo Morimoto', cognome: 'Morimoto', situacao: 'Regular' },
  { nome: 'Thaís Kinoshita', cognome: 'Kinoshita', situacao: 'Inadimplente' },
  { nome: 'Igor Nishimura', cognome: 'Nishimura', situacao: 'Regular' },
  { nome: 'Paula Matsumoto', cognome: 'Matsumoto', situacao: 'Desligado' },
  { nome: 'Vinícius Okada', cognome: 'Okada', situacao: 'Regular' },
  { nome: 'Tatiane Miyazaki', cognome: 'Miyazaki', situacao: 'Regular' },
  { nome: 'Amanda Shibata', cognome: 'Shibata', situacao: 'Regular' },
  { nome: 'Lucas Nishida', cognome: 'Nishida', situacao: 'Regular' },
  { nome: 'Letícia Arakaki', cognome: 'Arakaki', situacao: 'Inadimplente' },
  { nome: 'Gustavo Yamaguchi', cognome: 'Yamaguchi', situacao: 'Regular' },
  { nome: 'Renata Kawakami', cognome: 'Kawakami', situacao: 'Desligado' },
  { nome: 'Mariana Okamoto', cognome: 'Okamoto', situacao: 'Regular' },
  { nome: 'Tiago Iwasaki', cognome: 'Iwasaki', situacao: 'Inadimplente' },
  { nome: 'Elaine Nishikawa', cognome: 'Nishikawa', situacao: 'Regular' },
  { nome: 'Diego Kuniyoshi', cognome: 'Kuniyoshi', situacao: 'Regular' },
  { nome: 'Simone Murakami', cognome: 'Murakami', situacao: 'Regular' },
  { nome: 'Henrique Takemoto', cognome: 'Takemoto', situacao: 'Desligado' },
  { nome: 'Vanessa Ueno', cognome: 'Ueno', situacao: 'Regular' },
  { nome: 'Marcelo Kato', cognome: 'Kato', situacao: 'Regular' },
  { nome: 'Érika Kamikawa', cognome: 'Kamikawa', situacao: 'Regular' }
];
//até aqui

@Component({
  selector: 'app-list-associates',
  templateUrl: './list-associates.component.html',
  styleUrls: ['./list-associates.component.scss']
})
export class ListAssociatesComponent implements AfterViewInit {
  displayedColumns = ['nome', 'cognome', 'situacao'];
  dataSource = new MatTableDataSource<Associado>(EXAMPLE_DATA);

  filterNome = new FormControl('');
  filterSituacao = new FormControl('');
  filterGlobal = new FormControl('');

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // Custom filterPredicate para combinar filtros
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

    // Subscribe aos controles para atualizar filtro
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
