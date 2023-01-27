import { TestBed } from '@angular/core/testing';

import { GbpacketService } from './gbpacket.service';

describe('GbpacketService', () => {
  let service: GbpacketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GbpacketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
