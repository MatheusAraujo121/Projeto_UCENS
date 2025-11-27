import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Fornecedor } from '../../../../services/suppliers/supplier.interface';
import { SupplierService } from '../../../../services/suppliers/supplier.service';

import { CustomValidators } from '../../../../validators/custom-validators';

@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-suppliers.component.html',
  styleUrls: ['./edit-suppliers.component.scss']
})
export class EditSuppliersComponent implements OnInit {
  id: number | null = null;
  form!: FormGroup;
  supplier: Fornecedor | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(150)]],
      cnpj: ['', [Validators.required, CustomValidators.cnpjValidator()]],
      responsavel: ['', [Validators.maxLength(150)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      telefone: ['', [Validators.required, Validators.maxLength(20)]],
      ativo: [true, Validators.required],
      limiteCredito: [null],
      observacoes: ['', [Validators.maxLength(500)]]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
      this.loadSupplierData(this.id);
    }
  }

  loadSupplierData(id: number): void {
    this.supplierService.getSupplierById(id).subscribe({
      next: (data) => {
        if (data) {
          this.supplier = data;
          this.form.patchValue(data); 
        }
      },
      error: (err) => {
        this.snackBar.open('Fornecedor não encontrado.', 'Fechar', { duration: 3000 });
        this.router.navigate(['list-suppliers']);
      }
    });
  }

  atualizar() {
    if (this.form.invalid) {
      this.snackBar.open('Por favor, preencha todos os campos obrigatórios e corrija os erros.', 'Fechar', { duration: 3000 });
      this.form.markAllAsTouched();
      return;
    }

    if (this.id) {
      const updatedData = { ...this.form.value, id: this.id };
      this.supplierService.updateSupplier(this.id, updatedData).subscribe({
        next: () => {
          this.snackBar.open('Fornecedor atualizado com sucesso!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/view-suppliers', this.id]);
        },
        error: (err) => {
          this.snackBar.open('Ocorreu um erro ao tentar atualizar os dados. Por favor, tente novamente.', 'Fechar', { duration: 3000 });
        }
      });
    }
  }
}