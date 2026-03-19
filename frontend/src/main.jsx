import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage/LandingPage.jsx';
import SignUpPage from './SignUpPage/SignUpPage.jsx';
import MainAppPage from './mainappPage/src/app/App.tsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/app" element={<MainAppPage />} />
        <Route path="/" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
