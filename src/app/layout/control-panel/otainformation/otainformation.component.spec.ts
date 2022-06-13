import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OTAInformationComponent } from './otainformation.component';

describe('OTAInformationComponent', () => {
  let component: OTAInformationComponent;
  let fixture: ComponentFixture<OTAInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OTAInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OTAInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
