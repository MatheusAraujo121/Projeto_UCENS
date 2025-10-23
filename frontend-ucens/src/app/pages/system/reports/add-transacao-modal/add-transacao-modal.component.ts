import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportsService } from 'src/app/services/reports/reports.service';

@Component({
  selector: 'app-add-transacao-modal',
  templateUrl: './add-transacao-modal.component.html',
  styleUrls: ['./add-transacao-modal.component.scss']
})
export class AddTransacaoModalComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTransacaoModalComponent>,
    private reportsService: ReportsService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      descricao: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      data: [new Date(), Validators.required],
      tipo: ['', Validators.required],
      categoria: ['']
    });
  }

  onSave(): void {
    if (this.form.invalid) return;

    this.reportsService.addTransacaoManual(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('Lançamento salvo com sucesso!', 'Fechar', { duration: 3000 });
        this.dialogRef.close('saved');
      },
      error: () => {
        this.snackBar.open('Erro ao salvar lançamento.', 'Fechar', { duration: 3000 });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}