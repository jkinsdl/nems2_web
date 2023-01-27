import { TestBed } from '@angular/core/testing';

import { OtaService } from './ota.service';

describe('OtaService', () => {
  let service: OtaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
