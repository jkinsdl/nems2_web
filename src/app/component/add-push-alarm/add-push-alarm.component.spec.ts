import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPushAlarmComponent } from './add-push-alarm.component';

describe('AddPushAlarmComponent', () => {
  let component: AddPushAlarmComponent;
  let fixture: ComponentFixture<AddPushAlarmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPushAlarmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPushAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
