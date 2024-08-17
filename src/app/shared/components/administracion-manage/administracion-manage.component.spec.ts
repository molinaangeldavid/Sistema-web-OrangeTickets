import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionManageComponent } from './administracion-manage.component';

describe('AdministracionManageComponent', () => {
  let component: AdministracionManageComponent;
  let fixture: ComponentFixture<AdministracionManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministracionManageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdministracionManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
