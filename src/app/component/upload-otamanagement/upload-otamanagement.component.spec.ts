import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadOTAManagementComponent } from './upload-otamanagement.component';

describe('UploadOTAManagementComponent', () => {
  let component: UploadOTAManagementComponent;
  let fixture: ComponentFixture<UploadOTAManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadOTAManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadOTAManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
