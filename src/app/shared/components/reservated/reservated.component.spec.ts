import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservatedComponent } from './reservated.component';

describe('ReservatedComponent', () => {
  let component: ReservatedComponent;
  let fixture: ComponentFixture<ReservatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservatedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReservatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
