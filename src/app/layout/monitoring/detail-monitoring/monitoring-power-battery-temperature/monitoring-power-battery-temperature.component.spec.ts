import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringPowerBatteryTemperatureComponent } from './monitoring-power-battery-temperature.component';

describe('MonitoringPowerBatteryTemperatureComponent', () => {
  let component: MonitoringPowerBatteryTemperatureComponent;
  let fixture: ComponentFixture<MonitoringPowerBatteryTemperatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringPowerBatteryTemperatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringPowerBatteryTemperatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
