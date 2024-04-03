import { TestBed } from '@angular/core/testing';

import { XtService } from './xt.service';

describe('XtService', () => {
  let service: XtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
