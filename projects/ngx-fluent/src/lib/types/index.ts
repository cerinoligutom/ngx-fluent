import { FluentBundle } from '@fluent/bundle';

type FluentBundleCtorConfig = NonNullable<ConstructorParameters<typeof FluentBundle>[1]>;

export interface TranslationSourceConfig {
  path: string;
  bundleConfig?: FluentBundleCtorConfig;
}

export type TranslationSourceMap = Record<string, string | TranslationSourceConfig | FluentBundle>;
