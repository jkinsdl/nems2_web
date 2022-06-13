import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStatisticsPlanComponent } from './create-statistics-plan.component';

describe('CreateStatisticsPlanComponent', () => {
  let component: CreateStatisticsPlanComponent;
  let fixture: ComponentFixture<CreateStatisticsPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateStatisticsPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStatisticsPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
