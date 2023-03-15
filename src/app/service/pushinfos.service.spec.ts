import { TestBed } from '@angular/core/testing';

import { PushinfosService } from './pushinfos.service';

describe('PushinfosService', () => {
  let service: PushinfosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PushinfosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
