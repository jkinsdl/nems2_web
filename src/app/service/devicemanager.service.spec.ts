import { TestBed } from '@angular/core/testing';

import { DevicemanagerService } from './devicemanager.service';

describe('DevicemanagerService', () => {
  let service: DevicemanagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevicemanagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
