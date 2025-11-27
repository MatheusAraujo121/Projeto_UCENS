import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Boleto } from '../../../../services/financial/boleto.interface';

@Component({
  selector: 'app-boleto-detail',
  templateUrl: './boleto-detail.component.html',
  styleUrls: ['./boleto-detail.component.scss']
})
export class BoletoDetailComponent {

  constructor(
    public dialogRef: MatDialogRef<BoletoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public boleto: Boleto
  ) { }

  formatStatus(status: string): string {
    if (!status) return '';
    const formatted = status.replace(/([A-Z])/g, ' $1').trim();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  close(): void {
    this.dialogRef.close();
  }
}