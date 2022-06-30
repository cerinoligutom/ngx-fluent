import { TestBed } from '@angular/core/testing';

import { NgxFluentService } from './ngx-fluent.service';

describe('NgxFluentService', () => {
  let service: NgxFluentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxFluentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
