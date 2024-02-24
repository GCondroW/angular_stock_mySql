import { TestBed } from '@angular/core/testing';

import { NmService } from './nm.service';

describe('NmService', () => {
  let service: NmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
