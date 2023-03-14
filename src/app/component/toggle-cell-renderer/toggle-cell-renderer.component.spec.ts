import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleCellRendererComponent } from './toggle-cell-renderer.component';

describe('ToggleCellRendererComponent', () => {
  let component: ToggleCellRendererComponent;
  let fixture: ComponentFixture<ToggleCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToggleCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
