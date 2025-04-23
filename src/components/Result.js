import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Static Translations for UI Elements
const translations = {
  en: {
    title: "Detection Result",
    backHome: "Back to Home",
    readMore: "Read More",
    showLess: "Show Less",
    loading: "Translating...",
    error: "Something went wrong. Unable to detect a plant."
  },
  hi: {
    title: "रोग का पता",
    backHome: "होम पर वापस जाएं",
    readMore: "अधिक पढ़ें",
    showLess: "कम दिखाएं",
    loading: "अनुवाद हो रहा है...",
    error: "कुछ गलत हो गया। पौधे का पता नहीं लगा सके।"
  },
  mr: {
    title: "रोगाचे निदान",
    backHome: "मुख्यपृष्ठावर परत जा",
    readMore: "अधिक वाचा",
    showLess: "कमी दाखवा",
    loading: "भाषांतर चालू आहे...",
    error: "काहीतरी चूक झाली आहे. वनस्पती ओळखता आली नाही."
  }
};

const Result = ({ result }) => {
  const [language, setLanguage] = useState('en');
  const [translatedResult, setTranslatedResult] = useState(result);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(false);

  // Azure Translator API details
  const subscriptionKey = 'DE2DLHkrlEHK7Is6wQCUlWpNT6a3AXLr18AQLDeipaWwV4NzryPWJQQJ99BDACGhslBXJ3w3AAAbACOGh9Fl'; // Replace with your Azure Translator API key
  const region = 'centralindia';
  const endpoint = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0';

  useEffect(() => {
    // Set error if result is null or invalid
    if (
      !result ||
      result.toLowerCase().includes('not a plant') ||
      result.toLowerCase().includes('not plant') ||
      result.toLowerCase().includes('person') ||
      result.toLowerCase().includes('object') ||
      result.toLowerCase().includes('unable to detect plant disease') ||
      result.toLowerCase().includes('unable to fetch')
    ) {
      setError(true);
      setTranslatedResult(null);
      return;
    }

    // Retrieve the language from localStorage
    const handleLanguageChange = () => {
      const savedLanguage = localStorage.getItem("language") || "en";
      setLanguage(savedLanguage);

      if (savedLanguage !== "en" && result) {
        translateText(result, savedLanguage);
      } else {
        setTranslatedResult(result);
      }
    };

    window.addEventListener("languageChange", handleLanguageChange);
    handleLanguageChange();

    // Cleanup event listener
    return () => {
      window.removeEventListener("languageChange", handleLanguageChange);
    };
  }, [result]);

  const translateText = async (text, targetLang) => {
    if (!text) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${endpoint}&to=${targetLang}`,
        [{ Text: text }],
        {
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Ocp-Apim-Subscription-Region': region
          }
        }
      );

      // Extract translated text
      const translatedText = response.data[0].translations[0].text;
      setTranslatedResult(translatedText);
    } catch (error) {
      console.error('Translation error:', error.response?.data || error.message);
      setTranslatedResult(text); // Fallback to original text
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = () => setExpanded(!expanded);

  const { title, backHome, readMore, showLess, loading: loadingText, error: errorText } = translations[language];
  const splitResult = translatedResult ? translatedResult.split('\n') : [];
  const shortPreview = splitResult.slice(0, 3).join('\n');
  const fullResult = splitResult.join('\n');

  return (
    <div className="flex justify-center items-center min-h-screen p-6">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-4xl text-left leading-relaxed">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-700">{title}</h2>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-4">{loadingText}</div>
        ) : error ? (
          <div className="text-red-500 font-semibold text-center py-4">{errorText}</div>
        ) : (
          <div
            className="mb-6"
            dangerouslySetInnerHTML={{
              __html: (expanded ? fullResult : shortPreview)
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br />')
            }}
          ></div>
        )}

        {!loading && !expanded && !error && translatedResult && (
          <div className="text-blue-600 hover:underline cursor-pointer text-sm" onClick={toggleExpand}>
            {readMore}
          </div>
        )}

        {!loading && expanded && !error && translatedResult && (
          <div className="text-blue-600 hover:underline cursor-pointer text-sm" onClick={toggleExpand}>
            {showLess}
          </div>
        )}

        <button
          onClick={() => (window.location.href = '/plantdisease')}
          className="mt-8 w-full bg-green-500 text-white py-3 rounded"
        >
          {backHome}
        </button>
      </div>
    </div>
  );
};

export default Result;