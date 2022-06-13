import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringLocationComponent } from './monitoring-location.component';

describe('MonitoringLocationComponent', () => {
  let component: MonitoringLocationComponent;
  let fixture: ComponentFixture<MonitoringLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
