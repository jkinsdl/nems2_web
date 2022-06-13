import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShanghaiInfoComponent } from './shanghai-info.component';

describe('ShanghaiInfoComponent', () => {
  let component: ShanghaiInfoComponent;
  let fixture: ComponentFixture<ShanghaiInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShanghaiInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShanghaiInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
