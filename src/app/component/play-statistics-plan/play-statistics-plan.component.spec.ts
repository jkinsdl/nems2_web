import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayStatisticsPlanComponent } from './play-statistics-plan.component';

describe('PlayStatisticsPlanComponent', () => {
  let component: PlayStatisticsPlanComponent;
  let fixture: ComponentFixture<PlayStatisticsPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayStatisticsPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayStatisticsPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
