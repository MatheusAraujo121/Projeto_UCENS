import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsportivoComponent } from './esportivo.component';

describe('EsportivoComponent', () => {
  let component: EsportivoComponent;
  let fixture: ComponentFixture<EsportivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsportivoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsportivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
