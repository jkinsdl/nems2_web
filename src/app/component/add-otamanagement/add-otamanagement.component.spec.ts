import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOTAManagementComponent } from './add-otamanagement.component';

describe('AddOTAManagementComponent', () => {
  let component: AddOTAManagementComponent;
  let fixture: ComponentFixture<AddOTAManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOTAManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOTAManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
