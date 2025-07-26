import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExPresidentsComponent } from './ex-presidents.component';

describe('ExPresidentsComponent', () => {
  let component: ExPresidentsComponent;
  let fixture: ComponentFixture<ExPresidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExPresidentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExPresidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
