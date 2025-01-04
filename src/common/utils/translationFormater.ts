import { TranslationType } from '@/types';

export function createTranslation(translation: TranslationType): TranslationType {
  return {
    uz: translation?.uz,
    ru: translation?.ru,
    en: translation?.en,
  };
}
export function updateTranslation(
  translation: TranslationType,
  data: Partial<TranslationType>,
): TranslationType {
  return {
    uz: data?.uz || translation.uz,
    ru: data?.ru || translation.ru,
    en: data?.en || translation.en,
  };
}
