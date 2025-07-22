import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SedeCampestreIIComponent } from './sede-campestre-ii.component';

describe('SedeCampestreIIComponent', () => {
  let component: SedeCampestreIIComponent;
  let fixture: ComponentFixture<SedeCampestreIIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SedeCampestreIIComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SedeCampestreIIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
