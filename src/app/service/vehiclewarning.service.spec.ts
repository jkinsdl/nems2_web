import { TestBed } from '@angular/core/testing';

import { VehiclewarningService } from './vehiclewarning.service';

describe('VehiclewarningService', () => {
  let service: VehiclewarningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehiclewarningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
