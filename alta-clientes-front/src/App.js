import FormPage from './pages/FormPage';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<FormPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;