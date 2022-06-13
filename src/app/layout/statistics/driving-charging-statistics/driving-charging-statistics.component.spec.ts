import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivingChargingStatisticsComponent } from './driving-charging-statistics.component';

describe('DrivingChargingStatisticsComponent', () => {
  let component: DrivingChargingStatisticsComponent;
  let fixture: ComponentFixture<DrivingChargingStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrivingChargingStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivingChargingStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
