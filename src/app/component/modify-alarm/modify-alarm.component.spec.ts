import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyAlarmComponent } from './modify-alarm.component';

describe('ModifyAlarmComponent', () => {
  let component: ModifyAlarmComponent;
  let fixture: ComponentFixture<ModifyAlarmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyAlarmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
