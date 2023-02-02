import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteControlStateComponent } from './remote-control-state.component';

describe('RemoteControlStateComponent', () => {
  let component: RemoteControlStateComponent;
  let fixture: ComponentFixture<RemoteControlStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoteControlStateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteControlStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
