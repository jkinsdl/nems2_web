import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRegisterRemoteSettingComponent } from './add-register-remote-setting.component';

describe('AddRegisterRemoteSettingComponent', () => {
  let component: AddRegisterRemoteSettingComponent;
  let fixture: ComponentFixture<AddRegisterRemoteSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRegisterRemoteSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRegisterRemoteSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
