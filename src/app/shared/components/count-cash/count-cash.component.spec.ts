import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountCashComponent } from './count-cash.component';

describe('CountCashComponent', () => {
  let component: CountCashComponent;
  let fixture: ComponentFixture<CountCashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountCashComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CountCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
