import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCarRendererComponent } from './login-car-renderer.component';

describe('LoginCarRendererComponent', () => {
  let component: LoginCarRendererComponent;
  let fixture: ComponentFixture<LoginCarRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginCarRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginCarRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
