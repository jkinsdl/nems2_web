import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPublicPlatformManagementComponent } from './add-public-platform-management.component';

describe('AddPublicPlatformManagementComponent', () => {
  let component: AddPublicPlatformManagementComponent;
  let fixture: ComponentFixture<AddPublicPlatformManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPublicPlatformManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPublicPlatformManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
