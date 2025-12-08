import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import AddRoom from './pages/AddRoom';
import EditRoom from './pages/EditRoom';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-room" element={<AddRoom />} />
            <Route path="/edit-room/:id" element={<EditRoom />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
