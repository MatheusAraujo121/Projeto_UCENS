import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SedeSocialComponent } from './sede-social.component';

describe('SedeSocialComponent', () => {
  let component: SedeSocialComponent;
  let fixture: ComponentFixture<SedeSocialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SedeSocialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SedeSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
