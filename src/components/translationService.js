// translationService.js
import axios from 'axios';

export const translateText = async (text, targetLanguage) => {
    const langpair = `en|${targetLanguage}`;
    try {
      const response = await axios.get('https://apertium.org/apy/translate', {
        params: {
          langpair,
          q: text,
        },
      });
  
      return response.data.responseData.translatedText;
    } catch (error) {
      console.error('Translation Error:', error);
      return text; // Return original text if error occurs
    }
  };
