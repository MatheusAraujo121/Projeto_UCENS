import { Component, OnInit, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core'; // 1. Importe ViewEncapsulation
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AssociateService } from 'src/app/services/associates/associate.service';
import { Associate } from 'src/app/services/associates/associate.interface';
import { FinancialService } from 'src/app/services/financial/financial.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { saveAs } from 'file-saver';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-generate-boleto',
  templateUrl: './generate-boleto.component.html',
  styleUrls: ['./generate-boleto.component.scss'],
  encapsulation: ViewEncapsulation.None // 2. Adicione esta linha
})
export class GenerateBoletoComponent implements OnInit {
  boletoForm: FormGroup;
  associateCtrl = new FormControl('');
  
  allAssociates: Associate[] = [];
  filteredAssociates: Observable<Associate[]>;
  boletosIndividuais: { associate: Associate, valor: number }[] = [];
  paginatedBoletos: { associate: Associate, valor: number }[] = [];

  // Paginação
  pageSize = 5;
  currentPage = 0;
  totalSize = 0;

  isLoading = false;

  @ViewChild('associateInput') associateInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private associateService: AssociateService,
    private financialService: FinancialService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.boletoForm = this.fb.group({
      valorPadrao: [90.00, [Validators.required, Validators.min(0.01)]],
      dataVencimento: ['', Validators.required]
    });

    this.filteredAssociates = this.associateCtrl.valueChanges.pipe(
      startWith(null),
      map((associateName: string | null) => 
        associateName ? this._filter(associateName) : this.allAssociates.slice()
      ),
    );
  }

  ngOnInit(): void {
    this.loadAssociates();
    this.updatePage();
  }

  loadAssociates(): void {
    this.associateService.getAssociados().subscribe(data => {
      this.allAssociates = data;
    });
  }

  private _filter(value: string): Associate[] {
    const filterValue = value.toLowerCase();
    return this.allAssociates.filter(associate => 
      associate.nome.toLowerCase().includes(filterValue) &&
      !this.boletosIndividuais.some(b => b.associate.id === associate.id)
    );
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedAssociate: Associate = event.option.value;
    const valorPadrao = this.boletoForm.get('valorPadrao')?.value;

    if (!this.boletosIndividuais.some(b => b.associate.id === selectedAssociate.id)) {
      this.boletosIndividuais.push({ associate: selectedAssociate, valor: valorPadrao });
      this.updatePage();
    }
    
    this.associateInput.nativeElement.value = '';
    this.associateCtrl.setValue(null);
  }

  remove(boleto: { associate: Associate, valor: number }): void {
    const index = this.boletosIndividuais.indexOf(boleto);
    if (index >= 0) {
      this.boletosIndividuais.splice(index, 1);
      this.updatePage();
    }
  }

  handlePageEvent(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    this.updatePage();
  }

  private updatePage() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.totalSize = this.boletosIndividuais.length;
    this.paginatedBoletos = this.boletosIndividuais.slice(startIndex, endIndex);
  }

  onSubmit(): void {
    if (this.boletoForm.invalid) {
      this.snackBar.open('Por favor, preencha o valor padrão e a data de vencimento.', 'Fechar', { duration: 3000 });
      return;
    }

    if (this.boletosIndividuais.length === 0) {
      this.snackBar.open('Adicione pelo menos um associado para gerar a remessa.', 'Fechar', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const { dataVencimento } = this.boletoForm.value;

    const boletosParaGerar = this.boletosIndividuais.map(boleto => ({
      associadoId: boleto.associate.id,
      valor: boleto.valor,
      dataVencimento: dataVencimento
    }));

    this.financialService.gerarRemessa(boletosParaGerar).subscribe({
      next: (blob) => {
        const data = new Date();
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = (data.getMonth() + 1).toString(16).toUpperCase();
        const mesCodigo = data.getMonth() + 1 === 10 ? 'O' :
                         data.getMonth() + 1 === 11 ? 'N' :
                         data.getMonth() + 1 === 12 ? 'D' : mes;
        const codigoCedente = '57118';
        const fileName = `${codigoCedente}${mesCodigo}${dia}.txt`;

        saveAs(blob, fileName);

        this.isLoading = false;
        this.snackBar.open('Arquivo de remessa gerado com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/system/finantial-dashboard']);
      },
      error: (err) => {
        console.error('Erro ao gerar remessa:', err);
        this.snackBar.open('Falha ao gerar o arquivo de remessa. Verifique os dados e tente novamente.', 'Fechar', { duration: 4000 });
        this.isLoading = false;
      }
    });
  }
}