import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringMotorComponent } from './monitoring-motor.component';

describe('MonitoringMotorComponent', () => {
  let component: MonitoringMotorComponent;
  let fixture: ComponentFixture<MonitoringMotorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringMotorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringMotorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
