import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialReservesComponent } from './historial-reserves.component';

describe('HistorialReservesComponent', () => {
  let component: HistorialReservesComponent;
  let fixture: ComponentFixture<HistorialReservesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialReservesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistorialReservesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
