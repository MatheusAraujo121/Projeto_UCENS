import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-edit-expense',
  templateUrl: './edit-expense.component.html',
  styleUrls: ['./edit-expense.component.scss']
})
export class EditExpenseComponent implements OnInit {
  form!: FormGroup;
  expenseId: number | null = null;
  suppliers: Fornecedor[] = [];
  supplierFilterCtrl = new FormControl<string | Fornecedor>('', [Validators.required, this.requireMatch]);
  filteredSuppliers!: Observable<Fornecedor[]>;

  categorias: string[] = ['Alimentação', 'Transporte', 'Material de Escritório', 'Limpeza', 'Manutenção', 'Impostos', 'Outros'];
  filteredCategorias!: Observable<string[]>;
  
  previewUrl: SafeUrl | null = null;
  selectedFile: File | null = null;
  existingFileName: string | null = null;
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
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      id: [''],
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

    this.filteredCategorias = this.form.get('categoria')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCategorias(value || ''))
    );
    
    this.loadSuppliers().then(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.expenseId = +id;
        this.loadExpenseData(this.expenseId);
      }
    });

    this.setupConditionalLogic();
  }

  loadExpenseData(id: number): void {
    this.expensesService.getExpenseById(id).subscribe({
      next: (expense) => {
        this.form.patchValue(expense);
        
        if (expense.anexoUrl) {
            this.fileType = this.isImageUrl(expense.anexoUrl) ? 'image' : 'other';
            this.previewUrl = this.isImageUrl(expense.anexoUrl) ? this.sanitizer.bypassSecurityTrustUrl(expense.anexoUrl) : null;
            this.existingFileName = this.getFileNameFromUrl(expense.anexoUrl);
        }

        const selectedSupplier = this.suppliers.find(s => s.id === expense.fornecedorId);
        if (selectedSupplier) {
          this.supplierFilterCtrl.setValue(selectedSupplier);
        }
        
        this.checkPaymentStatus();
      },
      error: () => this.snackBar.open('Erro ao carregar os dados da despesa.', 'Fechar', { duration: 3000 })
    });
  }

  salvarAlteracoes(): void {
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
          this.updateDespesa();
        },
        error: () => {
          this.snackBar.open('Ocorreu um erro ao enviar o novo anexo.', 'Fechar', { duration: 3000 });
          this.isLoading = false;
        }
      });
    } else {
      this.updateDespesa();
    }
  }

  private updateDespesa(): void {
    const formValue = this.form.getRawValue();
    const selectedSupplier = this.supplierFilterCtrl.value as Fornecedor;

    const valorNumerico = formValue.valor ? parseFloat(String(formValue.valor).replace(/\./g, '').replace(',', '.')) : null;
    const jurosNumerico = formValue.multaJuros ? parseFloat(String(formValue.multaJuros).replace(/\./g, '').replace(',', '.')) : 0;

    const payload: Despesa = {
      ...formValue,
      valor: valorNumerico,
      multaJuros: jurosNumerico,
      fornecedorId: selectedSupplier.id,
      dataPagamento: formValue.dataPagamento ? formValue.dataPagamento : null,
    };

    if(this.expenseId) {
        this.expensesService.updateExpense(this.expenseId, payload).subscribe({
          next: () => {
            this.snackBar.open('Despesa atualizada com sucesso!', 'Fechar', { duration: 3000 });
            this.router.navigate(['/list-expenses']);
          },
          error: () => {
            this.snackBar.open('Ocorreu um erro ao atualizar a despesa.', 'Fechar', { duration: 3000 });
            this.isLoading = false;
          }
        });
    }
  }

  // --- Funções de Lógica e Validação (Reutilizadas do Create) ---
  
  private setupConditionalLogic(): void {
    const statusControl = this.form.get('status');
    const dataPagamentoControl = this.form.get('dataPagamento');
    const multaJurosControl = this.form.get('multaJuros');

    if (!statusControl || !dataPagamentoControl || !multaJurosControl) return;

    statusControl.valueChanges.pipe(startWith(statusControl.value), distinctUntilChanged()).subscribe(status => {
      this.isPaidOrOverdue = status === 'Paga' || status === 'Pago com atraso';

      if (status === 'Paga') {
        multaJurosControl.setValue(0);
        multaJurosControl.disable();
      } else {
        multaJurosControl.enable();
      }

      if (!this.isPaidOrOverdue) {
        dataPagamentoControl.setValue(null, { emitEvent: false });
        this.form.get('formaPagamento')?.setValue('');
        if(status !== 'Atrasada') multaJurosControl.setValue(null);
      }
    });

    dataPagamentoControl.valueChanges.subscribe(() => this.checkPaymentStatus());
    this.form.get('dataVencimento')?.valueChanges.subscribe(() => this.checkPaymentStatus());
  }
  
  private checkPaymentStatus(): void {
    const statusControl = this.form.get('status');
    const dataPagamento = this.form.get('dataPagamento')?.value;
    const dataVencimento = this.form.get('dataVencimento')?.value;

    if ((statusControl?.value === 'Paga' || statusControl?.value === 'Pago com atraso') && dataPagamento && dataVencimento) {
      const pagamento = new Date(dataPagamento);
      const vencimento = new Date(dataVencimento);
      
      pagamento.setHours(0, 0, 0, 0);
      vencimento.setHours(0, 0, 0, 0);

      if (pagamento > vencimento) {
        statusControl?.setValue('Pago com atraso');
      } else {
        statusControl?.setValue('Paga');
      }
    }
  }

  private requireMatch(control: AbstractControl): ValidationErrors | null {
    const selection: any = control.value;
    if (typeof selection === 'string' && selection !== '') { return { incorrect: true }; }
    return null;
  }
  
  loadSuppliers(): Promise<void> {
    return new Promise((resolve) => {
        this.supplierService.getSuppliers().subscribe(suppliers => {
          this.suppliers = suppliers;
          this.filteredSuppliers = this.supplierFilterCtrl.valueChanges.pipe(
            startWith(''),
            map(value => {
              const name = typeof value === 'string' ? value : value?.nome;
              return name ? this._filterSuppliers(name) : this.suppliers.slice();
            })
          );
          resolve();
        });
    });
  }

  private _filterSuppliers(name: string): Fornecedor[] {
    const filterValue = name.toLowerCase();
    return this.suppliers.filter(supplier => supplier.nome.toLowerCase().includes(filterValue));
  }
  
  displaySupplierName(supplier: Fornecedor): string {
    return supplier && supplier.nome ? supplier.nome : '';
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
  private _filterCategorias(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.categorias.filter(option => option.toLowerCase().includes(filterValue));
  }
  private isImageUrl(url: string): boolean {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }

  private getFileNameFromUrl(url: string): string {
      try {
        const urlObject = new URL(url);
        const pathSegments = urlObject.pathname.split('/');
        return decodeURIComponent(pathSegments.pop() || '');
      } catch (e) {
        return url.substring(url.lastIndexOf('/') + 1);
      }
  }
}