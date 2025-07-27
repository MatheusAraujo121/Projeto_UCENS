import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssociatesComponent } from './edit-associates.component';

describe('EditAssociatesComponent', () => {
  let component: EditAssociatesComponent;
  let fixture: ComponentFixture<EditAssociatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAssociatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAssociatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
