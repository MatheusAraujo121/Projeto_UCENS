import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SedeCampestreIComponent } from './sede-campestre-i.component';

describe('SedeCampestreIComponent', () => {
  let component: SedeCampestreIComponent;
  let fixture: ComponentFixture<SedeCampestreIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SedeCampestreIComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SedeCampestreIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
