import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PlantDisease = ({ setResult }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en'); // Fetch language from localStorage
  const navigate = useNavigate();

  // Static translations for text
  const translations = {
    en: {
      title: "Plant Disease Detection",
      uploadButton: "Upload",
      uploading: "Uploading... Please wait.",
      selectImageError: "Please select an image!",
      error: "Something went wrong. Try again!",
    },
    hi: {
      title: "पौधे की बीमारी का पता लगाना",
      uploadButton: "अपलोड करें",
      uploading: "अपलोड हो रहा है... कृपया प्रतीक्षा करें।",
      selectImageError: "कृपया एक छवि चुनें!",
      error: "कुछ गलत हो गया। पुनः प्रयास करें!",
    },
    mr: {
      title: "वनस्पती रोग ओळख",
      uploadButton: "अपलोड करा",
      uploading: "अपलोड करत आहे... कृपया प्रतीक्षा करा.",
      selectImageError: "कृपया प्रतिमा निवडा!",
      error: "काहीतरी चूक झाली आहे. पुन्हा प्रयत्न करा!",
    },
  };

  // Update language dynamically when it changes in localStorage
  useEffect(() => {
    const handleLanguageChange = () => {
      const selectedLanguage = localStorage.getItem('language') || 'en';
      setLanguage(selectedLanguage);
    };

    // Add event listener for `languageChange`
    window.addEventListener('languageChange', handleLanguageChange);

    // Cleanup the event listener
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert(translations[language].selectImageError);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/plantdisease', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || translations[language].error);
      }

      const data = await response.json();

      // Directly set the result without external translation
      setResult(data.result);
      navigate('/result'); // Navigate to result page
    } catch (error) {
      console.error('Error:', error);
      setError(translations[language].error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-6 text-center text-green-600">
          {translations[language].title}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {loading ? (
            <div className="text-center text-green-500">
              <p>{translations[language].uploading}</p>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full text-white py-2 rounded bg-green-500 hover:bg-green-600"
            >
              {translations[language].uploadButton}
            </button>
          )}
          {error && (
            <div className="text-red-500 text-center mt-4">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PlantDisease;
