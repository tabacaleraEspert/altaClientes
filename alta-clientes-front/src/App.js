import FormPage from './pages/FormPage';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App" style={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<FormPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;