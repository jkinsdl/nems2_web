import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailServerLogComponent } from './detail-server-log.component';

describe('DetailServerLogComponent', () => {
  let component: DetailServerLogComponent;
  let fixture: ComponentFixture<DetailServerLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailServerLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailServerLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
