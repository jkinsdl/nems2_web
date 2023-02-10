import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelDistanceStatisticsComponent } from './travel-distance-statistics.component';

describe('TravelDistanceStatisticsComponent', () => {
  let component: TravelDistanceStatisticsComponent;
  let fixture: ComponentFixture<TravelDistanceStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelDistanceStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelDistanceStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
