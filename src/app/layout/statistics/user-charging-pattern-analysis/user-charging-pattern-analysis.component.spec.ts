import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChargingPatternAnalysisComponent } from './user-charging-pattern-analysis.component';

describe('UserChargingPatternAnalysisComponent', () => {
  let component: UserChargingPatternAnalysisComponent;
  let fixture: ComponentFixture<UserChargingPatternAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserChargingPatternAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserChargingPatternAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
