import { FluentFunction, TextTransform } from "@fluent/bundle";

export interface TranslationSource {
  path: string,
    bundleConfig: {
      functions?: Record<string, FluentFunction>;
      transform?: TextTransform;
      useIsolating?: boolean
    }
}
