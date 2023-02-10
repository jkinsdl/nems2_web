import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyVehicleStatisticsComponent } from './monthly-vehicle-statistics.component';

describe('MonthlyVehicleStatisticsComponent', () => {
  let component: MonthlyVehicleStatisticsComponent;
  let fixture: ComponentFixture<MonthlyVehicleStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyVehicleStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyVehicleStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
