import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAssociatesComponent } from './create-associates.component';

describe('CreateAssociatesComponent', () => {
  let component: CreateAssociatesComponent;
  let fixture: ComponentFixture<CreateAssociatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAssociatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAssociatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
