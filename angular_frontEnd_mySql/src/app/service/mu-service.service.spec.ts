import { TestBed } from '@angular/core/testing';

import { MuServiceService } from './mu-service.service';

describe('MuServiceService', () => {
  let service: MuServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MuServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
