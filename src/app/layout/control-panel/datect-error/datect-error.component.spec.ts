import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatectErrorComponent } from './datect-error.component';

describe('DatectErrorComponent', () => {
  let component: DatectErrorComponent;
  let fixture: ComponentFixture<DatectErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatectErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatectErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
