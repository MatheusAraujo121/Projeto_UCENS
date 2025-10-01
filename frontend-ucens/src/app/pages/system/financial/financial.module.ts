import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule

import { FinancialRoutingModule } from './financial-routing.module';
import { FinancialComponent } from './financial.component';
import { FinancialDashboardComponent } from './financial-dashboard/financial-dashboard.component';
import { GenerateBoletoComponent } from './generate-boleto/generate-boleto.component';


@NgModule({
  declarations: [
    FinancialComponent,
    FinancialDashboardComponent,
    GenerateBoletoComponent
  ],
  imports: [
    CommonModule,
    FinancialRoutingModule,
    ReactiveFormsModule // Add ReactiveFormsModule here
  ]
})
export class FinancialModule { }