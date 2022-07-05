import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

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

  it('should return null initially', () => {
    expect(service.locale.value).toBeNull();
  });

  it('should return new locale', () => {
    service.setLocale('en');
    expect(service.locale.value).toBe('en');
  });

  it('unresolved locale returns null', () => {
    const key = 'test-key';
    service.setLocale('non-existent');
    expect(service.translate(key)).toBeNull();
  });

  it('resolved locale and message returns translation', () => {
    const key = 'test-key';
    const value = 'test-translation';
    const translation = `${key} = ${value}`;

    httpSpy.get.and.returnValue(of(translation));
    service.setLocale('en');

    expect(service.translate(key)).toBe(value);
  });

  it('resolved locale and unresolved message returns key', () => {
    const key = 'unknown-key';
    const translation = 'test-key = test-translation';

    httpSpy.get.and.returnValue(of(translation));
    service.setLocale('en');

    expect(service.translate(key)).toBe(key);
  });
});
