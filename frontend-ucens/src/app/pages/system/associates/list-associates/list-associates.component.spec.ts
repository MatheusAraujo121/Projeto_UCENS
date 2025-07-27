import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAssociatesComponent } from './list-associates.component';

describe('ListAssociatesComponent', () => {
  let component: ListAssociatesComponent;
  let fixture: ComponentFixture<ListAssociatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAssociatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAssociatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
