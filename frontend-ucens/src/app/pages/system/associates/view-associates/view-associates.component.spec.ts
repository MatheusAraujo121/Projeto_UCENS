import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssociatesComponent } from './view-associates.component';

describe('ViewAssociatesComponent', () => {
  let component: ViewAssociatesComponent;
  let fixture: ComponentFixture<ViewAssociatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAssociatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAssociatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
