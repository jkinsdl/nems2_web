import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringWarningComponent } from './monitoring-warning.component';

describe('MonitoringWarningComponent', () => {
  let component: MonitoringWarningComponent;
  let fixture: ComponentFixture<MonitoringWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringWarningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
