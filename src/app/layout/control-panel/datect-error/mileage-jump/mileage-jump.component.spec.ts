import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MileageJumpComponent } from './mileage-jump.component';

describe('MileageJumpComponent', () => {
  let component: MileageJumpComponent;
  let fixture: ComponentFixture<MileageJumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MileageJumpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MileageJumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
