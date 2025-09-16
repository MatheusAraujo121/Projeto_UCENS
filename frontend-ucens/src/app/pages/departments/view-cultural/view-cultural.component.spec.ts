import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCulturalComponent } from './view-cultural.component';

describe('ViewCulturalComponent', () => {
  let component: ViewCulturalComponent;
  let fixture: ComponentFixture<ViewCulturalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCulturalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCulturalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
