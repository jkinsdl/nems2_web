import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringPowerBatteryInfomationComponent } from './monitoring-power-battery-infomation.component';

describe('MonitoringPowerBatteryInfomationComponent', () => {
  let component: MonitoringPowerBatteryInfomationComponent;
  let fixture: ComponentFixture<MonitoringPowerBatteryInfomationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringPowerBatteryInfomationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringPowerBatteryInfomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
