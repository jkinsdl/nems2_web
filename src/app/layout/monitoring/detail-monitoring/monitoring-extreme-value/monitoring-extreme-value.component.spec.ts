import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringExtremeValueComponent } from './monitoring-extreme-value.component';

describe('MonitoringExtremeValueComponent', () => {
  let component: MonitoringExtremeValueComponent;
  let fixture: ComponentFixture<MonitoringExtremeValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringExtremeValueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringExtremeValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
