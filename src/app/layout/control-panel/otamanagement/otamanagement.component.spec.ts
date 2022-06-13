import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OTAManagementComponent } from './otamanagement.component';

describe('OTAManagementComponent', () => {
  let component: OTAManagementComponent;
  let fixture: ComponentFixture<OTAManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OTAManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OTAManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
