import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPublicPlatformMappingComponent } from './add-public-platform-mapping.component';

describe('AddPublicPlatformMappingComponent', () => {
  let component: AddPublicPlatformMappingComponent;
  let fixture: ComponentFixture<AddPublicPlatformMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPublicPlatformMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPublicPlatformMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
