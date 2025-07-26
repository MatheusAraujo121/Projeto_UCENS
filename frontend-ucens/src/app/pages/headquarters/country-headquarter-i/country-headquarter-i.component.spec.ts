import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryHeadquarterIComponent } from './country-headquarter-i.component';

describe('CountryHeadquarterIComponent', () => {
  let component: CountryHeadquarterIComponent;
  let fixture: ComponentFixture<CountryHeadquarterIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryHeadquarterIComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryHeadquarterIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
