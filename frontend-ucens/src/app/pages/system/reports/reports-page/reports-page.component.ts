import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RelatorioAssociado, RelatorioFinanceiro, TransacaoItem } from 'src/app/services/reports/reports.interface';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { AddTransacaoModalComponent } from '../add-transacao-modal/add-transacao-modal.component';

@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.scss']
})
export class ReportsPageComponent implements OnInit {
  // Relatório de Associados
  associadosDisplayedColumns: string[] = ['associado', 'dependentes'];
  associadosDataSource = new MatTableDataSource<RelatorioAssociado>();

  // Relatório Financeiro
  financeiroDisplayedColumns: string[] = ['data', 'descricao', 'valor'];
  financeiroDataSource = new MatTableDataSource<TransacaoItem>();
  relatorioFinanceiro: RelatorioFinanceiro | null = null;
  dateRangeForm: FormGroup;

  @ViewChild('associadosSort') associadosSort!: MatSort;
  @ViewChild('financeiroSort') financeiroSort!: MatSort;

  constructor(
    private reportsService: ReportsService,
    private fb: FormBuilder,
    public dialog: MatDialog
    ) {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        this.dateRangeForm = this.fb.group({
            start: [firstDayOfMonth],
            end: [today]
        });
    }

  ngOnInit(): void {
    this.loadAssociados();
    this.loadFinanceiro();
  }

  loadAssociados(): void {
    this.reportsService.getRelatorioAssociados().subscribe(data => {
      this.associadosDataSource.data = data;
      this.associadosDataSource.sort = this.associadosSort;
    });
  }

  loadFinanceiro(): void {
    const { start, end } = this.dateRangeForm.value;
    if (start && end) {
      this.reportsService.getRelatorioFinanceiro(start, end).subscribe(data => {
        this.relatorioFinanceiro = data;
        this.financeiroDataSource.data = data.transacoes;
        this.financeiroDataSource.sort = this.financeiroSort;
      });
    }
  }

  openAddTransacaoModal(): void {
    const dialogRef = this.dialog.open(AddTransacaoModalComponent, {
        width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result === 'saved') {
            this.loadFinanceiro(); // Recarrega o relatório financeiro
        }
    });
  }

  getSituacaoClass(situacao: string): string {
    switch (situacao) {
        case 'Regular': return 'status-regular';
        case 'Inadimplente': return 'status-inadimplente';
        default: return '';
    }
  }
}