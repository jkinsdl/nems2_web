import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemoteParameterConfigurationInfoComponent } from './add-remote-parameter-configuration-info.component';

describe('AddRemoteParameterConfigurationInfoComponent', () => {
  let component: AddRemoteParameterConfigurationInfoComponent;
  let fixture: ComponentFixture<AddRemoteParameterConfigurationInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRemoteParameterConfigurationInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoteParameterConfigurationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
