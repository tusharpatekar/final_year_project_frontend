import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  // Static translations for the Home page text
  const translations = {
    en: {
      title: "AI Driven Crop Disease Detection & Management",
      subtitle: "Harnessing AI to Keep Your Plants Healthy",
      button: "Get Started"
    },
    hi: {
      title: "एआई आधारित फसल रोग पहचान और प्रबंधन",
      subtitle: "अपने पौधों को स्वस्थ रखने के लिए एआई का उपयोग",
      button: "शुरू करें"
    },
    mr: {
      title: "एआय आधारित पिक रोग ओळख आणि व्यवस्थापन",
      subtitle: "तुमचे पिक निरोगी ठेवण्यासाठी एआयचा वापर",
      button: "सुरू करा"
    }
  };

  // Listen for language change event and update language accordingly
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem('language') || 'en'); // Update language on change
    };

    window.addEventListener('languageChange', handleLanguageChange); // Add event listener

    // Clean up event listener when the component unmounts
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  const handleButtonClick = () => {
    navigate('/plantdisease'); // Redirect to /plantdisease
  };

  return (
    <div 
      className="h-screen bg-cover bg-center" 
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')` }}
    >
      {/* Overlay */}
      <div className="bg-black bg-opacity-60 h-full w-full flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          {translations[language].title}
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 mb-6">
          {translations[language].subtitle}
        </p>
        <button 
          onClick={handleButtonClick} // Handle button click
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg shadow-lg transition duration-300"
        >
          {translations[language].button}
        </button>
      </div>
    </div>
  );
};

export default Home;
