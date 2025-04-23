import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('loggedIn'));
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [weather, setWeather] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [showWeatherPopup, setShowWeatherPopup] = useState(false);

  const weatherApiKey = 'bcc8c74e18c846c7b7b200603242712'; // Replace with your WeatherAPI Key

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    i18n.changeLanguage(savedLanguage);
    setLanguage(savedLanguage);
  }, [i18n]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setLanguage(lang);
    window.dispatchEvent(new Event("languageChange"));
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    setIsLoggedIn(false);
    setWeather(null); // Clear weather data
    setLocationError(null); // Reset location error

    // Clear any stored location-related permissions (if needed)
    if (navigator.geolocation) {
      // No direct way to revoke location permission, but we can ignore any existing geolocation state
      localStorage.removeItem('locationPermission'); // You could store location permissions here if needed
    }

    alert('Logged out successfully!');
    navigate('/');
  };

  const fetchWeather = (latitude, longitude) => {
    setWeatherLoading(true);
    setLocationError(null);

    fetch(`https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${latitude},${longitude}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setLocationError(data.error.message);
        } else {
          setWeather(data.current);
        }
        setWeatherLoading(false);
      })
      .catch((error) => {
        setLocationError('Error fetching weather data.');
        setWeatherLoading(false);
      });
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          setLocationError('Location permission denied or error occurred.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    if (isLoggedIn === 'true') {
      // Only ask for location permission when the user logs in
     
        getLocation(); // Ask for location permission and fetch weather data
        localStorage.setItem('locationPermission', 'granted'); // Store that permission was granted
      
    } else {
      setWeather(null);
    }
  }, [isLoggedIn]);

  const toggleWeatherPopup = () => {
    setShowWeatherPopup((prevState) => !prevState);
  };

  const closePopup = () => {
    setShowWeatherPopup(false);
  };

  return (
    <nav className="bg-green-600 text-white p-4 shadow-md fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side of navbar - TechSquad logo */}
        <a href="/" className="text-2xl font-bold ml-4">
          TechSquad
        </a>

        {/* Centered navigation links */}
        <div className="flex-grow flex justify-center space-x-6">
          <a href="/home" className="hover:text-green-300">{t("navbar.home")}</a>
          <a href="/aboutus" className="hover:text-green-300">{t("navbar.about")}</a>

          {isLoggedIn ? (
            <>
              <a href="/plantdisease" className="hover:text-green-300">{t("navbar.detect")}</a>
              <a href="/" className="hover:text-green-300" onClick={handleLogout}>
                {t("navbar.logout")}
              </a>
            </>
          ) : (
            <>
              <a href="/signup" className="hover:text-green-300">{t("navbar.signup")}</a>
              <a href="/" className="hover:text-green-300">{t("navbar.login")}</a>
            </>
          )}
        </div>

        {/* Right side of navbar */}
        <div className="flex items-center space-x-4">
          {/* Cloud Icon - Positioned just before language dropdown */}
          <div
            className="relative group cursor-pointer"
            onClick={toggleWeatherPopup}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8 text-white hover:text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 18H5c-1.104 0-2-.896-2-2s.896-2 2-2h1c0-2.21 1.79-4 4-4s4 1.79 4 4h2c1.104 0 2 .896 2 2s-.896 2-2 2z"
              />
            </svg>

            {showWeatherPopup && (
              <div
                className="absolute top-12 right-0 bg-white p-4 rounded shadow-lg text-black w-48"
                onMouseLeave={closePopup}
              >
                <div className="text-sm font-semibold">Weather</div>
                {weatherLoading ? (
                  <div>Loading...</div>
                ) : locationError ? (
                  <div className="text-red-500">{locationError}</div>
                ) : weather ? (
                  <div>
                    <div>Temperature: {weather.temp_c}°C</div>
                    <div>Condition: {weather.condition.text}</div>
                    <div>Humidity: {weather.humidity}%</div>
                  </div>
                ) : (
                  <div>No weather data available</div>
                )}
              </div>
            )}
          </div>

          <select
            className="bg-green-700 text-white p-2 rounded"
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="mr">मराठी</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
