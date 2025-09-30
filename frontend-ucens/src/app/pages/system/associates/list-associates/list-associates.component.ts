import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssociateService } from 'src/app/services/associates/associate.service';
import { Associate } from 'src/app/services/associates/associate.interface';

@Component({
  selector: 'app-list-associates',
  templateUrl: './list-associates.component.html',
  styleUrls: ['./list-associates.component.scss']
})
export class ListAssociatesComponent implements AfterViewInit, OnInit {
  displayedColumns = ['nome', 'cognome', 'situacao'];
  dataSource = new MatTableDataSource<Associate>([]);

  filterNome = new FormControl('');
  filterSituacao = new FormControl('');
  filterGlobal = new FormControl('');

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private associateService: AssociateService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadAssociates();
  }

  loadAssociates(): void {
    this.associateService.getAssociados().subscribe({
      next: (associados) => {
        this.dataSource.data = associados;
      },
      error: (err) => {
        this.snackBar.open('Ocorreu um erro ao buscar os associados:', 'Fechar', { duration: 3000 });
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
