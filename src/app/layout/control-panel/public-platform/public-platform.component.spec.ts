import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPlatformComponent } from './public-platform.component';

describe('PublicPlatformComponent', () => {
  let component: PublicPlatformComponent;
  let fixture: ComponentFixture<PublicPlatformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicPlatformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
