import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbnormalVehicleHistoryComponent } from './abnormal-vehicle-history.component';

describe('AbnormalVehicleHistoryComponent', () => {
  let component: AbnormalVehicleHistoryComponent;
  let fixture: ComponentFixture<AbnormalVehicleHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbnormalVehicleHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbnormalVehicleHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
