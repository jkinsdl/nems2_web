import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridTooltipComponent } from './grid-tooltip.component';

describe('GridTooltipComponent', () => {
  let component: GridTooltipComponent;
  let fixture: ComponentFixture<GridTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridTooltipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
