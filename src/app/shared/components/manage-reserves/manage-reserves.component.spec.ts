import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageReservesComponent } from './manage-reserves.component';

describe('ManageReservesComponent', () => {
  let component: ManageReservesComponent;
  let fixture: ComponentFixture<ManageReservesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageReservesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageReservesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
