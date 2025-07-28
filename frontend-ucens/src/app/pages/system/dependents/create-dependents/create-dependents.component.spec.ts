import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDependentsComponent } from './create-dependents.component';

describe('CreateDependentsComponent', () => {
  let component: CreateDependentsComponent;
  let fixture: ComponentFixture<CreateDependentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDependentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDependentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
