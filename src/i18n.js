import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n
  .use(Backend) // Load translations from JSON files
  .use(LanguageDetector) // Automatically detect user language
  .use(initReactI18next) // Initialize with React
  .init({
    fallbackLng: "en", // Default language
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Path to translation files
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
