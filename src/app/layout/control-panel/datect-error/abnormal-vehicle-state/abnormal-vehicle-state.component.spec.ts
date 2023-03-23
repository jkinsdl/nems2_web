import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbnormalVehicleStateComponent } from './abnormal-vehicle-state.component';

describe('AbnormalVehicleStateComponent', () => {
  let component: AbnormalVehicleStateComponent;
  let fixture: ComponentFixture<AbnormalVehicleStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbnormalVehicleStateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbnormalVehicleStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
