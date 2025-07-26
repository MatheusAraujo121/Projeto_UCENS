import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryHeadquarterIIComponent } from './country-headquarter-ii.component';

describe('CountryHeadquarterIIComponent', () => {
  let component: CountryHeadquarterIIComponent;
  let fixture: ComponentFixture<CountryHeadquarterIIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryHeadquarterIIComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryHeadquarterIIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
