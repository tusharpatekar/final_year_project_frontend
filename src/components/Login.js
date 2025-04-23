import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Assuming this is correctly imported
import './spinner.css'; // Add your spinner CSS for loading effect

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en'); // Default language from localStorage
  const navigate = useNavigate();

  // Static translations for the Login page text
  const translations = {
    en: {
      title: "Login",
      email: "Email",
      password: "Password",
      submit: "Login",
      googleLogin: "Login with Google",
      error: "An unexpected error occurred. Please try again.",
      noAccount: "Don't have an account?",
      signUp: "Sign up",
    },
    hi: {
      title: "लॉगिन",
      email: "ईमेल",
      password: "पासवर्ड",
      submit: "लॉगिन",
      googleLogin: "गूगल से लॉगिन करें",
      error: "एक अप्रत्याशित त्रुटि हुई है। कृपया फिर से प्रयास करें।",
      noAccount: "क्या आपके पास खाता नहीं है?",
      signUp: "साइन अप करें",
    },
    mr: {
      title: "लॉगिन",
      email: "ईमेल",
      password: "पासवर्ड",
      submit: "लॉगिन",
      googleLogin: "गूगल वापरून लॉगिन करा",
      error: "एक अप्रत्याशित त्रुटी झाली आहे. कृपया पुन्हा प्रयत्न करा.",
      noAccount: "तुमच्याकडे अकाउंट नाही का?",
      signUp: "साइन अप करा",
    },
  };

  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Input Validation
    if (!email || !password) {
      setError('Both email and password are required.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setIsLoading(true); // Start loading spinner

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        localStorage.setItem('loggedIn', 'true');
        navigate('/plantdisease');
      } else {
        setError(data.error);
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  // Google Sign-In Initialization (with Google Client ID)
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        '763127770724-isjj3oae0bug2vk42ueo8090h4je9jpa.apps.googleusercontent.com', // Your Google Client ID
      callback: handleGoogleLogin,
    });

    google.accounts.id.renderButton(
      document.getElementById('google-signin'),
      { theme: 'outline', size: 'large' }
    );
  }, []);

  // Google Sign-In Handler
  const handleGoogleLogin = (response) => {
    setIsLoading(true);
    const userObject = jwtDecode(response.credential);
    console.log('Google User:', userObject);

    // Send token to backend for verification
    fetch('http://127.0.0.1:5000/google-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: response.credential }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          alert(data.message);
          localStorage.setItem('loggedIn', 'true');
          navigate('/plantdisease');
          window.location.reload();
        } else {
          setError(data.error);
        }
      })
      .catch((err) => {
        console.error('Google Login Error:', err);
        setError('An error occurred during Google login.');
      })
      .finally(() => setIsLoading(false));
  };

  // Listen for language change event
  useEffect(() => {
    const handleLanguageChange = (e) => {
      const selectedLanguage = localStorage.getItem('language') || 'en';
      setLanguage(selectedLanguage); // Save selected language in localStorage
    };

    // Add event listener for language change
    window.addEventListener('languageChange', handleLanguageChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-6 text-center">{translations[language].title}</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium">{translations[language].email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-green-500"
              placeholder={translations[language].email}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">{translations[language].password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-green-500"
              placeholder={translations[language].password}
            />
          </div>
          {error && (
            <div className="text-red-500 text-center mb-4">{translations[language].error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : translations[language].submit}
          </button>
        </form>

        {/* Google Sign-In Button */}
        <div id="google-signin" className="mt-4 flex justify-center"></div>

        <p className="text-sm text-center mt-4">
          {translations[language].noAccount}{' '}
          <span
            className="text-green-500 cursor-pointer"
            onClick={() => navigate('/signup')}
          >
            {translations[language].signUp}
          </span>
        </p>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex justify-center items-center mt-4">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
