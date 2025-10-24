import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingPaymentCancellationModalComponent } from './pending-payment-cancellation-modal.component';

describe('PendingPaymentCancellationModalComponent', () => {
  let component: PendingPaymentCancellationModalComponent;
  let fixture: ComponentFixture<PendingPaymentCancellationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingPaymentCancellationModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingPaymentCancellationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
