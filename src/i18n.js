import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 번역 리소스
import translationEN from './locales/en/translation.json';
import translationKO from './locales/ko/translation.json';
import translationMS from './locales/ms/translation.json';

// 지원 언어 리소스
const resources = {
  en: {
    translation: translationEN
  },
  ko: {
    translation: translationKO
  },
  ms: {
    translation: translationMS
  }
};

// 저장된 언어 확인 또는 기본값 설정
const savedLanguage = localStorage.getItem('i18nextLng');
const defaultLanguage = savedLanguage || 'ko';

i18n
  // 브라우저의 언어 감지 기능 사용
  .use(LanguageDetector)
  // react-i18next 초기화
  .use(initReactI18next)
  // i18n 초기화
  .init({
    resources,
    lng: defaultLanguage, // 기본 언어를 한국어로 지정
    fallbackLng: 'ko',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React는 이미 XSS를 방지함
    },

    // 언어 감지 옵션
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;