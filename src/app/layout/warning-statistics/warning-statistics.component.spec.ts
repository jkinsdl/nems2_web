import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningStatisticsComponent } from './warning-statistics.component';

describe('WarningStatisticsComponent', () => {
  let component: WarningStatisticsComponent;
  let fixture: ComponentFixture<WarningStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarningStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
