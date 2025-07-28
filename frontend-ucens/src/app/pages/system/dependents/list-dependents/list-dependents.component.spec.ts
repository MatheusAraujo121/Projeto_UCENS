import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDependentsComponent } from './list-dependents.component';

describe('ListDependentsComponent', () => {
  let component: ListDependentsComponent;
  let fixture: ComponentFixture<ListDependentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDependentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDependentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
