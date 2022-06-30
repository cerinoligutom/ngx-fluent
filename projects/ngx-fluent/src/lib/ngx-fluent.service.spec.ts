import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { NgxFluentService } from './ngx-fluent.service';

describe('NgxFluentService', () => {
  let service: NgxFluentService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    const _httpSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [NgxFluentService, { provide: HttpClient, useValue: _httpSpy }],
    });

    service = TestBed.inject(NgxFluentService);
    httpSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null initially', () => {});

  it('should return new locale', () => {});

  it('unresolved locale returns key', () => {});

  it('resolved locale and message returns translation', () => {});

  it('resolved locale and unresolved message returns key', () => {});

  it('two locales, both resolved', () => {});

  it('two locales, one resolved', () => {});
});
