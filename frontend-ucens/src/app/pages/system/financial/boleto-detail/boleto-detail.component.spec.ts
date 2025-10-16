import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoletoDetailComponent } from './boleto-detail.component';

describe('BoletoDetailComponent', () => {
  let component: BoletoDetailComponent;
  let fixture: ComponentFixture<BoletoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoletoDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoletoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
