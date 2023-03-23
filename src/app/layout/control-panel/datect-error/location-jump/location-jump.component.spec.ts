import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationJumpComponent } from './location-jump.component';

describe('LocationJumpComponent', () => {
  let component: LocationJumpComponent;
  let fixture: ComponentFixture<LocationJumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationJumpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationJumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
