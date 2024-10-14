import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Application from './pages/Application';
import TestPage from './pages/TestPage';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/application" element={<Application />} />
        <Route path="/testpage" element={<TestPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
