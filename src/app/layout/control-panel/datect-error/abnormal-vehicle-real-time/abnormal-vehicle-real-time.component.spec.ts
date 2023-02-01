import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbnormalVehicleRealTimeComponent } from './abnormal-vehicle-real-time.component';

describe('AbnormalVehicleRealTimeComponent', () => {
  let component: AbnormalVehicleRealTimeComponent;
  let fixture: ComponentFixture<AbnormalVehicleRealTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbnormalVehicleRealTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbnormalVehicleRealTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
