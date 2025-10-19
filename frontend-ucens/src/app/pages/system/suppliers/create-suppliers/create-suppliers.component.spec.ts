import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSuppliersComponent } from './create-suppliers.component';

describe('CreateSuppliersComponent', () => {
  let component: CreateSuppliersComponent;
  let fixture: ComponentFixture<CreateSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSuppliersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
