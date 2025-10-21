import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { startWith, map, distinctUntilChanged } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ExpensesService } from '../../../../services/expenses/expenses.service';
import { SupplierService } from '../../../../services/suppliers/supplier.service';
import { FileUploadService } from '../../../../services/uploads/file-upload.service';
import { Fornecedor } from '../../../../services/suppliers/supplier.interface';
import { Despesa } from '../../../../services/expenses/expenses.interface';

@Component({
  selector: 'app-create-expense',
  templateUrl: './create-expense.component.html',
  styleUrls: ['./create-expense.component.scss']
})
export class CreateExpenseComponent implements OnInit {
  form!: FormGroup;
  suppliers: Fornecedor[] = [];
  supplierFilterCtrl = new FormControl<string | Fornecedor>('', [Validators.required, this.requireMatch]);
  filteredSuppliers!: Observable<Fornecedor[]>;

  categorias: string[] = ['Alimentação', 'Transporte', 'Material de Escritório', 'Limpeza', 'Manutenção', 'Impostos', 'Outros'];
  filteredCategorias!: Observable<string[]>;
  
  previewUrl: SafeUrl | null = null;
  selectedFile: File | null = null;
  fileType: 'image' | 'other' | null = null;
  isLoading = false;
  isPaidOrOverdue = false;

  constructor(
    private fb: FormBuilder,
    private expensesService: ExpensesService,
    private supplierService: SupplierService,
    private fileUploadService: FileUploadService,
    private snackBar: MatSnackBar,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      descricao: ['', [Validators.required, Validators.maxLength(150)]],
      categoria: ['', [Validators.required, Validators.maxLength(50)]],
      status: ['Pendente', [Validators.required, Validators.maxLength(30)]],
      valor: [null, [Validators.required]],
      dataVencimento: ['', Validators.required],
      dataPagamento: [null],
      formaPagamento: ['', [Validators.maxLength(50)]],
      numeroFatura: ['', [Validators.maxLength(50)]],
      multaJuros: [null],
      observacoes: ['', [Validators.maxLength(500)]],
      anexoUrl: ['']
    });

    this.loadSuppliers();
    this.setupConditionalLogic();
    
    this.filteredCategorias = this.form.get('categoria')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCategorias(value || ''))
    );
  }

  private setupConditionalLogic(): void {
    const statusControl = this.form.get('status');
    const dataPagamentoControl = this.form.get('dataPagamento');
    const dataVencimentoControl = this.form.get('dataVencimento');
    const multaJurosControl = this.form.get('multaJuros');

    if (!statusControl || !dataPagamentoControl || !dataVencimentoControl || !multaJurosControl) return;

    // Lógica principal baseada na mudança de STATUS
    statusControl.valueChanges.pipe(distinctUntilChanged()).subscribe(status => {
      this.isPaidOrOverdue = status === 'Paga' || status === 'Pago com atraso';

      if (status === 'Paga') {
        // Se for 'Paga', zera e desabilita os juros
        multaJurosControl.setValue(0); // A máscara vai formatar para "R$ 0,00"
        multaJurosControl.disable();
      } else {
        // Habilita para 'Pago com atraso' e outros status
        multaJurosControl.enable();
      }

      // Limpa os campos de pagamento se o status voltar para Pendente ou for Cancelado
      if (!this.isPaidOrOverdue) {
        dataPagamentoControl.setValue(null, { emitEvent: false }); // emitEvent: false para evitar loop
        this.form.get('formaPagamento')?.setValue('');
        multaJurosControl.setValue(null);
      }
    });

    // Lógica para auto-ajustar o STATUS com base nas datas
    dataPagamentoControl.valueChanges.subscribe(() => this.checkPaymentStatus());
    dataVencimentoControl.valueChanges.subscribe(() => this.checkPaymentStatus());
  }
  
  private checkPaymentStatus(): void {
    const statusControl = this.form.get('status');
    const dataPagamento = this.form.get('dataPagamento')?.value;
    const dataVencimento = this.form.get('dataVencimento')?.value;

    // Só executa se o usuário já tiver intenção de pagar (status Paga ou Pago com atraso)
    if ((statusControl?.value === 'Paga' || statusControl?.value === 'Pago com atraso') && dataPagamento && dataVencimento) {
      const pagamento = new Date(dataPagamento);
      const vencimento = new Date(dataVencimento);
      
      pagamento.setHours(0, 0, 0, 0);
      vencimento.setHours(0, 0, 0, 0);

      // Define o status correto baseado na comparação
      if (pagamento > vencimento) {
        statusControl?.setValue('Pago com atraso');
      } else {
        statusControl?.setValue('Paga');
      }
    }
  }

  // --- Funções de Upload e Autocomplete (sem alteração) ---
  private _filterCategorias(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.categorias.filter(option => option.toLowerCase().includes(filterValue));
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      if (file.type.startsWith('image/')) {
        this.fileType = 'image';
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
        };
      } else {
        this.fileType = 'other';
        this.previewUrl = null;
      }
    } else {
        this.selectedFile = null;
        this.fileType = null;
        this.previewUrl = null;
    }
  }

  lancarDespesa(): void {
    if (this.form.invalid || this.supplierFilterCtrl.invalid) {
      this.snackBar.open('Por favor, verifique os campos com erro.', 'Fechar', { duration: 3000 });
      this.form.markAllAsTouched();
      this.supplierFilterCtrl.markAsTouched();
      return;
    }
    this.isLoading = true;

    if (this.selectedFile) {
      this.fileUploadService.uploadImage(this.selectedFile, 'despesas').subscribe({
        next: (response) => {
          this.form.patchValue({ anexoUrl: response.url });
          this.cadastrarDespesa();
        },
        error: () => {
          this.snackBar.open('Ocorreu um erro ao enviar o anexo.', 'Fechar', { duration: 3000 });
          this.isLoading = false;
        }
      });
    } else {
      this.cadastrarDespesa();
    }
  }

  private cadastrarDespesa(): void {
    // getRawValue() pega até os campos desabilitados (como juros quando é 'Paga')
    const formValue = this.form.getRawValue();
    const selectedSupplier = this.supplierFilterCtrl.value as Fornecedor;

    const valorNumerico = formValue.valor ? parseFloat(String(formValue.valor).replace(/\./g, '').replace(',', '.')) : null;
    const jurosNumerico = formValue.multaJuros ? parseFloat(String(formValue.multaJuros).replace(/\./g, '').replace(',', '.')) : 0;

    const payload: Partial<Despesa> = {
      ...formValue,
      valor: valorNumerico,
      multaJuros: jurosNumerico,
      fornecedorId: selectedSupplier.id,
      dataPagamento: formValue.dataPagamento ? formValue.dataPagamento : null,
    };

    this.expensesService.createExpense(payload as Despesa).subscribe({
      next: () => {
        this.snackBar.open('Despesa lançada com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['/list-expenses']);
      },
      error: () => {
        this.snackBar.open('Ocorreu um erro ao lançar a despesa.', 'Fechar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  private requireMatch(control: AbstractControl): ValidationErrors | null {
    const selection: any = control.value;
    if (typeof selection === 'string' && selection !== '') { return { incorrect: true }; }
    return null;
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe(suppliers => {
      this.suppliers = suppliers;
      this.filteredSuppliers = this.supplierFilterCtrl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.nome;
          return name ? this._filterSuppliers(name) : this.suppliers.slice();
        })
      );
    });
  }

  private _filterSuppliers(name: string): Fornecedor[] {
    const filterValue = name.toLowerCase();
    return this.suppliers.filter(supplier => supplier.nome.toLowerCase().includes(filterValue));
  }

  displaySupplierName(supplier: Fornecedor): string {
    return supplier && supplier.nome ? supplier.nome : '';
  }
}