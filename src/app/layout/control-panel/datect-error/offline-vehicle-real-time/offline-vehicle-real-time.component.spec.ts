import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineVehicleRealTimeComponent } from './offline-vehicle-real-time.component';

describe('OfflineVehicleRealTimeComponent', () => {
  let component: OfflineVehicleRealTimeComponent;
  let fixture: ComponentFixture<OfflineVehicleRealTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflineVehicleRealTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineVehicleRealTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
