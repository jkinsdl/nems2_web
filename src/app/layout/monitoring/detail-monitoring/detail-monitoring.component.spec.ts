import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMonitoringComponent } from './detail-monitoring.component';

describe('DetailMonitoringComponent', () => {
  let component: DetailMonitoringComponent;
  let fixture: ComponentFixture<DetailMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailMonitoringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
