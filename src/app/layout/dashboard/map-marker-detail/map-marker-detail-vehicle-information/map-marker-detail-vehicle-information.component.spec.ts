import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapMarkerDetailVehicleInformationComponent } from './map-marker-detail-vehicle-information.component';

describe('MapMarkerDetailVehicleInformationComponent', () => {
  let component: MapMarkerDetailVehicleInformationComponent;
  let fixture: ComponentFixture<MapMarkerDetailVehicleInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapMarkerDetailVehicleInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapMarkerDetailVehicleInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
