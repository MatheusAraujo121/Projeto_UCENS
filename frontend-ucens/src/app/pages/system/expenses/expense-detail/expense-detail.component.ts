import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Despesa } from '../../../../services/expenses/expenses.interface';

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.scss']
})
export class ExpenseDetailComponent {

  constructor(
    public dialogRef: MatDialogRef<ExpenseDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public despesa: Despesa,
    private router: Router
  ) { }

  formatStatus(status: string): string {
    if (!status) return '';
    // Formata "Pago com atraso" para "Pago com Atraso"
    return status.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Paga': return 'status-paid';
      case 'Pago com atraso': return 'status-paid-late';
      case 'Pendente': return 'status-pending';
      case 'Atrasada': return 'status-overdue';
      case 'Cancelada': return 'status-cancelled';
      default: return 'status-default';
    }
  }
  
  close(): void {
    this.dialogRef.close();
  }

  edit(): void {
    this.router.navigate(['/edit-expense', this.despesa.id]);
    this.close();
  }

  delete(): void {
    this.dialogRef.close('delete');
  }
}