import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateBoletoComponent } from './generate-boleto.component';

describe('GenerateBoletoComponent', () => {
  let component: GenerateBoletoComponent;
  let fixture: ComponentFixture<GenerateBoletoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateBoletoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateBoletoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
