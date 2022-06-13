import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringDetailZoomComponent } from './monitoring-detail-zoom.component';

describe('MonitoringDetailZoomComponent', () => {
  let component: MonitoringDetailZoomComponent;
  let fixture: ComponentFixture<MonitoringDetailZoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringDetailZoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringDetailZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
