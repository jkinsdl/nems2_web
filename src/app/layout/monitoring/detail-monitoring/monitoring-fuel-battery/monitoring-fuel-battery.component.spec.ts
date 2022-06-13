import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringFuelBatteryComponent } from './monitoring-fuel-battery.component';

describe('MonitoringFuelBatteryComponent', () => {
  let component: MonitoringFuelBatteryComponent;
  let fixture: ComponentFixture<MonitoringFuelBatteryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringFuelBatteryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringFuelBatteryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
