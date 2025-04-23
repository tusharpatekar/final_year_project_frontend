import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import PlantDisease from './components/PlantDisease';
import Result from './components/Result';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import AboutUs from './components/AboutUs/AboutUs';

const App = () => {
  const [detectionResult, setDetectionResult] = useState('');

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/agri-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Router>
        <Navbar />
        <div className="container mx-auto pt-8 bg-agriculture-background">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/aboutus" element={<AboutUs />} />
            
            {/* Protected Routes */}
            <Route
              path="/plantdisease"
              element={
                <ProtectedRoute>
                  <PlantDisease setResult={setDetectionResult} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/result"
              element={
                <ProtectedRoute>
                  <Result result={detectionResult} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
