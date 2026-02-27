// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Connect from './pages/Connect';
import Ask from './pages/Ask';
import Results from './pages/Results';
import Practice from './pages/Practice';
import './styles/globals.css';

// Only show app Navbar on inner pages (not landing)
function Layout() {
  const { pathname } = useLocation();
  const isLanding = pathname === '/';

  return (
    <>
      {!isLanding && <Navbar />}
      <Routes>
        <Route path="/"        element={<Landing />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/ask"     element={<Ask />}     />
        <Route path="/results"  element={<Results />} />
        <Route path="/practice" element={<Practice />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ToastProvider>
          <Layout />
        </ToastProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
