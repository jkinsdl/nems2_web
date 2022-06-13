import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningIssueComponent } from './warning-issue.component';

describe('WarningIssueComponent', () => {
  let component: WarningIssueComponent;
  let fixture: ComponentFixture<WarningIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarningIssueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
