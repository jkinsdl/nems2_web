import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineVehicleHistoryComponent } from './offline-vehicle-history.component';

describe('OfflineVehicleHistoryComponent', () => {
  let component: OfflineVehicleHistoryComponent;
  let fixture: ComponentFixture<OfflineVehicleHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflineVehicleHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineVehicleHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
