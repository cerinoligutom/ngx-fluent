import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { NgxFluentService } from './ngx-fluent.service';

describe('NgxFluentService', () => {
  let fluentService: NgxFluentService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    const _httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'pipe']);

    TestBed.configureTestingModule({
      providers: [NgxFluentService, { provide: HttpClient, useValue: _httpSpy }],
    });

    httpSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    httpSpy.get.and.returnValue(of(''));

    fluentService = TestBed.inject(NgxFluentService);
  });

  function runCommonTests() {
    it('localeChanges should emit new locale', () => {
      fluentService.setLocale('test-locale');

      fluentService.localeChanges.subscribe((locale) => {
        expect(locale).toBe('test-locale');
      });
    });

    it('currentLocale should return null initially', () => {
      expect(fluentService.currentLocale).toBeNull();
    });

    it('currentLocale should return new locale after setting setLocale', () => {
      fluentService.setLocale('en');
      expect(fluentService.currentLocale).toBe('en');
    });

    it('unresolved locale returns null', async () => {
      const key = 'test-key';
      fluentService.setLocale('non-existent');

      const result = await fluentService.translate(key);
      expect(result).toBeNull();
    });

    it('resolved locale and message returns translation', async () => {
      const key = 'test-key';
      const value = 'test-translation';
      const translation = `${key} = ${value}`;

      httpSpy.get.and.returnValue(of(translation));
      fluentService.setLocale('en');

      const result = await fluentService.translate(key);
      expect(result).toBe(value);
    });

    it('resolved locale and unresolved message returns null', async () => {
      const key = 'unknown-key';
      const translation = 'test-key = test-translation';

      httpSpy.get.and.returnValue(of(translation));
      fluentService.setLocale('en');

      const result = await fluentService.translate(key);
      expect(result).toBeNull();
    });
  }

  describe('SetTranslationSourceMap option uses Record<string, string>', () => {
    beforeEach(() => {
      fluentService.setTranslationSourceMap({
        en: 'assets/locales/en.ftl',
      });
    });

    runCommonTests();
  });

  describe('SetTranslationSourceMap option uses Record<string, FluentBundleOptions>', () => {
    beforeEach(() => {
      fluentService.setTranslationSourceMap({
        en: { path: 'assets/locales/en.ftl', bundleConfig: undefined },
      });
    });

    runCommonTests();
  });
});
