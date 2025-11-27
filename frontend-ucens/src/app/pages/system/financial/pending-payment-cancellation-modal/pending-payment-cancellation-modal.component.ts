import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Boleto } from '../../../../services/financial/boleto.interface'; 

@Component({
  selector: 'app-pending-payment-cancellation-modal',
  templateUrl: './pending-payment-cancellation-modal.component.html',
  styleUrls: ['./pending-payment-cancellation-modal.component.scss']
})
export class PendingPaymentCancellationModalComponent {
  constructor(
    public dialogRef: MatDialogRef<PendingPaymentCancellationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { boletos: Boleto[] },
    private router: Router
  ) {}

 
  close(): void {
    this.dialogRef.close();
  }


  goToGenerateRemessa(): void {
    this.router.navigate(['/generate-boleto']);
    this.close(); 
  }
}
