import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringEngineComponent } from './monitoring-engine.component';

describe('MonitoringEngineComponent', () => {
  let component: MonitoringEngineComponent;
  let fixture: ComponentFixture<MonitoringEngineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringEngineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
