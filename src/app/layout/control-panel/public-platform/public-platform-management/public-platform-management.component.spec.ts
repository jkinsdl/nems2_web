import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPlatformManagementComponent } from './public-platform-management.component';

describe('PublicPlatformManagementComponent', () => {
  let component: PublicPlatformManagementComponent;
  let fixture: ComponentFixture<PublicPlatformManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicPlatformManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPlatformManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
