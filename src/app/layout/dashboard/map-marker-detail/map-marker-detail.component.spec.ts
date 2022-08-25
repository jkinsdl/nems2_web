import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapMarkerDetailComponent } from './map-marker-detail.component';

describe('MapMarkerDetailComponent', () => {
  let component: MapMarkerDetailComponent;
  let fixture: ComponentFixture<MapMarkerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapMarkerDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapMarkerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
