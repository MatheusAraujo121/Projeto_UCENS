import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDependentsComponent } from './edit-dependents.component';

describe('EditDependentsComponent', () => {
  let component: EditDependentsComponent;
  let fixture: ComponentFixture<EditDependentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDependentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDependentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
