import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushAlarmComponent } from './push-alarm.component';

describe('PushAlarmComponent', () => {
  let component: PushAlarmComponent;
  let fixture: ComponentFixture<PushAlarmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PushAlarmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PushAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
