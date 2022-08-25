import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbnormalLocationVehicleComponent } from './abnormal-location-vehicle.component';

describe('AbnormalLocationVehicleComponent', () => {
  let component: AbnormalLocationVehicleComponent;
  let fixture: ComponentFixture<AbnormalLocationVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbnormalLocationVehicleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbnormalLocationVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
