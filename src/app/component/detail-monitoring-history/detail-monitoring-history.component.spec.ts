import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMonitoringHistoryComponent } from './detail-monitoring-history.component';

describe('DetailMonitoringHistoryComponent', () => {
  let component: DetailMonitoringHistoryComponent;
  let fixture: ComponentFixture<DetailMonitoringHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailMonitoringHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailMonitoringHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
