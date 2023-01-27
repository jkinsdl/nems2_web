import { TestBed } from '@angular/core/testing';

import { ForwardingService } from './forwarding.service';

describe('ForwardingService', () => {
  let service: ForwardingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForwardingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
