import { TestBed } from '@angular/core/testing';

import { VehiclemanagerService } from './vehiclemanager.service';

describe('VehiclemanagerService', () => {
  let service: VehiclemanagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehiclemanagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
