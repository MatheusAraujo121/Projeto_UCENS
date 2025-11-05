import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Corrige a inicialização das fontes
(pdfMake as any).vfs = pdfFonts.vfs;

@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.css']
})
export class ReportsPageComponent {
  private apiUrl = 'http://localhost:5277/api/relatorio';


  constructor(private http: HttpClient) {}

  gerarRelatorio(tipo: string) {
    let endpoint = `${this.apiUrl}/${tipo}`;

    // --- Parâmetros automáticos para relatórios que exigem data ---
    const hoje = new Date();
    const dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString();
    const dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).toISOString();

    if (['fluxo-caixa', 'contas-a-receber', 'contas-a-pagar', 'contas-pagas',
         'receitas-arrecadadas', 'contas-recebidas', 'extrato-financeiro',
         'arrecadacao-mensalidades', 'despesas-por-emissao', 'resumo-financeiro', 'previsao-financeira'].includes(tipo)) {
      endpoint += `?dataInicio=${dataInicio}&dataFim=${dataFim}`;
    }

    if (tipo === 'receitas-mensais') {
      endpoint += `?ano=${hoje.getFullYear()}`;
    }

    if (tipo === 'movimento-diario') {
      endpoint += `?data=${hoje.toISOString()}`;
    }

    // --- Chamada ao backend ---
    this.http.get(endpoint).subscribe({
      next: (data: any) => {
        this.gerarPDF(tipo, data);
      },
      error: (err) => {
        console.error('Erro ao gerar relatório:', err);
        alert('Falha ao gerar relatório.');
      }
    });
  }

  gerarPDF(tipo: string, data: any) {
    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 40],
      content: [
        { text: 'UNIÃO CULT. ESP. NIPO-BRASILEIRA DE SOROCABA', style: 'header', alignment: 'center' },
        { text: `Relatório: ${tipo.replace(/-/g, ' ').toUpperCase()}`, style: 'subheader', alignment: 'center' },
        { text: '\n\n', margin: [0, 5, 0, 10] },
        this.criarTabela(data)
      ],
      styles: {
        header: { fontSize: 14, bold: true },
        subheader: { fontSize: 12, bold: true },
        tableHeader: { bold: true, fillColor: '#eeeeee' },
      }
    };

    pdfMake.createPdf(docDefinition).open();
  }

  criarTabela(data: any) {
    if (!Array.isArray(data) || data.length === 0) {
      return { text: 'Nenhum dado encontrado para este relatório.', italics: true, alignment: 'center' };
    }

    const colunas = Object.keys(data[0]);
    const header = colunas.map(c => ({ text: c.toUpperCase(), style: 'tableHeader' }));
    const body = [header, ...data.map(item => colunas.map(c => item[c] ?? ''))];

    return {
      layout: {
        fillColor: (rowIndex: number) => rowIndex === 0 ? '#eeeeee' : null,
        hLineWidth: () => 0.7,
        vLineWidth: () => 0.7,
        hLineColor: () => '#aaaaaa',
        vLineColor: () => '#aaaaaa',
      },
      table: { headerRows: 1, widths: Array(colunas.length).fill('*'), body }
    };
  }
}
