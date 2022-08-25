import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataForwardingComponent } from './data-forwarding.component';

describe('DataForwardingComponent', () => {
  let component: DataForwardingComponent;
  let fixture: ComponentFixture<DataForwardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataForwardingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataForwardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
