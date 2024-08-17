import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialReportsComponent } from './historial-reports.component';

describe('HistorialReportsComponent', () => {
  let component: HistorialReportsComponent;
  let fixture: ComponentFixture<HistorialReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistorialReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
