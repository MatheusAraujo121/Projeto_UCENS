import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDependentsComponent } from './view-dependents.component';

describe('ViewDependentsComponent', () => {
  let component: ViewDependentsComponent;
  let fixture: ComponentFixture<ViewDependentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDependentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDependentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
