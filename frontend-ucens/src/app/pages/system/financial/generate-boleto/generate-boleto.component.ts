import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssociateService } from 'src/app/services/associates/associate.service';
import { Associate } from 'src/app/services/associates/associate.interface';
import { FinancialService } from 'src/app/services/financial/financial.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-generate-boleto',
  templateUrl: './generate-boleto.component.html',
  styleUrls: ['./generate-boleto.component.scss']
})
export class GenerateBoletoComponent implements OnInit {
  boletoForm: FormGroup;
  associates: Associate[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private associateService: AssociateService,
    private financialService: FinancialService
  ) {
    this.boletoForm = this.fb.group({
      associadoIds: [[], Validators.required],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      dataVencimento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAssociates();
  }

  loadAssociates(): void {
    this.associateService.getAssociados().subscribe(data => {
      this.associates = data;
    });
  }

  onSubmit(): void {
    if (this.boletoForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.financialService.gerarRemessa(this.boletoForm.value).subscribe(
      (blob) => {
        const fileName = `REMESSA_${new Date().toISOString().slice(0, 10)}.txt`;
        saveAs(blob, fileName);
        this.isLoading = false;
        alert('Arquivo de remessa gerado com sucesso!');
      },
      (error) => {
        console.error('Erro ao gerar remessa:', error);
        alert('Falha ao gerar o arquivo de remessa.');
        this.isLoading = false;
      }
    );
  }
}