import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransacaoModalComponent } from './add-transacao-modal.component';

describe('AddTransacaoModalComponent', () => {
  let component: AddTransacaoModalComponent;
  let fixture: ComponentFixture<AddTransacaoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTransacaoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTransacaoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
