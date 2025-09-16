import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSportyComponent } from './view-sporty.component';

describe('ViewSportyComponent', () => {
  let component: ViewSportyComponent;
  let fixture: ComponentFixture<ViewSportyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSportyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSportyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
