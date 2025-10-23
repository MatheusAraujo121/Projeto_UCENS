import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

// Serviços e Interfaces
import { SupplierService } from '../../../../services/suppliers/supplier.service';

// ADICIONADO: Importe seu validador (ajuste o caminho se necessário)
import { CustomValidators } from 'src/app/validators/custom-validators'; 

@Component({
  selector: 'app-create-supplier',
  templateUrl: './create-suppliers.component.html',
  styleUrls: ['./create-suppliers.component.scss']
})
export class CreateSuppliersComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(150)]],
      // ADICIONADO: Campo CNPJ com validadores
      cnpj: ['', [Validators.required, CustomValidators.cnpjValidator()]],
      responsavel: ['', [Validators.maxLength(150)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      telefone: ['', [Validators.required, Validators.maxLength(20)]],
      ativo: [true], // Valor padrão para o toggle
      limiteCredito: [null],
      observacoes: ['', [Validators.maxLength(500)]]
    });
  }

  efetuarCadastro() {
    if (this.form.invalid) {
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios e corrija os erros.', 'Fechar', { duration: 3000 });
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const novoFornecedor = this.form.value;

    this.supplierService.createSupplier(novoFornecedor).subscribe({
      next: (response) => {
        this.snackBar.open('Fornecedor cadastrado com sucesso!', 'Fechar', { duration: 3000 });
        this.router.navigate(['list-suppliers']);
      },
      error: (err) => {
        this.snackBar.open('Erro ao cadastrar. Verifique os dados e tente novamente.', 'Fechar', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }
}