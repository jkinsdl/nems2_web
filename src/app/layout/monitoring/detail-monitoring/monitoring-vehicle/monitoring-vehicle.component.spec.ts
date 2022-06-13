import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringVehicleComponent } from './monitoring-vehicle.component';

describe('MonitoringVehicleComponent', () => {
  let component: MonitoringVehicleComponent;
  let fixture: ComponentFixture<MonitoringVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringVehicleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
