import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPlatformForSpecificPeriodComponent } from './public-platform-for-specific-period.component';

describe('PublicPlatformForSpecificPeriodComponent', () => {
  let component: PublicPlatformForSpecificPeriodComponent;
  let fixture: ComponentFixture<PublicPlatformForSpecificPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicPlatformForSpecificPeriodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPlatformForSpecificPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
