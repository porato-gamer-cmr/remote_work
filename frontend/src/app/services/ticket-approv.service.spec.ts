import { TestBed } from '@angular/core/testing';

import { TicketApprovService } from './ticket-approv.service';

describe('TicketApprovService', () => {
  let service: TicketApprovService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketApprovService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
