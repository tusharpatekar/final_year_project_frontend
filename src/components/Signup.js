import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en'); // Default to 'en'
  const navigate = useNavigate();

  const translations = {
    en: {
      title: "Signup",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      submit: "Signup",
      emailError: "Email is required",
      validEmailError: "Please enter a valid email address",
      passwordError: "Password is required",
      passwordLengthError: "Password must be at least 6 characters long",
      confirmPasswordError: "Confirm password is required",
      passwordMatchError: "Passwords do not match",
      successMessage: "Signup successful. You can now login.",
      errorMessage: "An error occurred while signing up.",
    },
    hi: {
      title: "साइनअप करें",
      email: "ईमेल",
      password: "पासवर्ड",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      submit: "साइनअप करें",
      emailError: "ईमेल आवश्यक है",
      validEmailError: "कृपया एक वैध ईमेल पता दर्ज करें",
      passwordError: "पासवर्ड आवश्यक है",
      passwordLengthError: "पासवर्ड कम से कम 6 वर्ण का होना चाहिए",
      confirmPasswordError: "पासवर्ड की पुष्टि आवश्यक है",
      passwordMatchError: "पासवर्ड मेल नहीं खाते",
      successMessage: "साइनअप सफल। अब आप लॉगिन कर सकते हैं।",
      errorMessage: "साइनअप करते समय एक त्रुटि हुई।",
    },
    mr: {
      title: "साइनअप करा",
      email: "ईमेल",
      password: "पासवर्ड",
      confirmPassword: "पासवर्डची पुष्टी करा",
      submit: "साइनअप करा",
      emailError: "ईमेल आवश्यक आहे",
      validEmailError: "कृपया एक वैध ईमेल पत्ता द्या",
      passwordError: "पासवर्ड आवश्यक आहे",
      passwordLengthError: "पासवर्ड किमान 6 वर्णांचा असावा",
      confirmPasswordError: "पासवर्डची पुष्टी आवश्यक आहे",
      passwordMatchError: "पासवर्ड जुळत नाहीत",
      successMessage: "साइनअप यशस्वी. आता आपण लॉगिन करू शकता.",
      errorMessage: "साइनअप करतांना त्रुटी आली.",
    },
  };

  // Language change event listener
  useEffect(() => {
    const handleLanguageChange = (e) => {
      const selectedLanguage = localStorage.getItem('language') || 'en';
      setLanguage(selectedLanguage); // Save selected language in localStorage
    };

    window.addEventListener('languageChange', handleLanguageChange);

    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Validate inputs
    const validationErrors = {};

    if (!email) {
      validationErrors.email = translations[language].emailError;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = translations[language].validEmailError;
    }

    if (!password) {
      validationErrors.password = translations[language].passwordError;
    } else if (password.length < 6) {
      validationErrors.password = translations[language].passwordLengthError;
    }

    if (!confirmPassword) {
      validationErrors.confirmPassword = translations[language].confirmPasswordError;
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = translations[language].passwordMatchError;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Proceed with signup if validation passes
    try {
      const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        alert(translations[language].successMessage);
        navigate('/'); // Redirect to login
      } else {
        alert(data.error || translations[language].errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(translations[language].errorMessage);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-6 text-center">{translations[language].title}</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-sm font-medium">{translations[language].email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-2 border rounded focus:outline-none focus:ring focus:ring-lightGreen ${errors.email ? 'border-red-500' : ''}`}
              placeholder={translations[language].email}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">{translations[language].password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-2 border rounded focus:outline-none focus:ring focus:ring-lightGreen ${errors.password ? 'border-red-500' : ''}`}
              placeholder={translations[language].password}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">{translations[language].confirmPassword}</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full p-2 border rounded focus:outline-none focus:ring focus:ring-lightGreen ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder={translations[language].confirmPassword}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>
          <button
            type="submit"
            className="w-full text-white py-2 rounded bg-green-500"
          >
            {translations[language].submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
