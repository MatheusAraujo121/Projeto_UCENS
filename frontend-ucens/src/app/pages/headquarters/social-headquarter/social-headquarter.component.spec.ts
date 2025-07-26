import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialHeadquarterComponent } from './social-headquarter.component';

describe('SocialHeadquarterComponent', () => {
  let component: SocialHeadquarterComponent;
  let fixture: ComponentFixture<SocialHeadquarterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialHeadquarterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialHeadquarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
