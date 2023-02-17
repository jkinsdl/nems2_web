import { TestBed } from '@angular/core/testing';

import { RegionmanagersService } from './regionmanagers.service';

describe('RegionmanagersService', () => {
  let service: RegionmanagersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegionmanagersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
