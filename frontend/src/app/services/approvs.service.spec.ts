import { TestBed } from '@angular/core/testing';

import { ApprovsService } from './approvs.service';

describe('ApprovsService', () => {
  let service: ApprovsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApprovsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
