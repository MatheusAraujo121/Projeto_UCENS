import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportyComponent } from './sporty.component';

describe('SportyComponent', () => {
  let component: SportyComponent;
  let fixture: ComponentFixture<SportyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SportyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
