import React from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ BENAR: Import hanya Routes dan Route
import Home from './Pages/Home';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';

function App() {
  return (
    <Routes>  {/* ✅ BENAR: Hanya Routes, tanpa BrowserRouter */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;