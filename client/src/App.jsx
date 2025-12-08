import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import AddRoom from './pages/AddRoom';
import EditRoom from './pages/EditRoom';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import RoomDetails from './pages/RoomDetails';
import Contacts from './pages/Contacts';
import Reviews from './pages/Reviews';
import Home from './pages/Home';
import Reception from './pages/Reception';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-room" element={<AddRoom />} />
            <Route path="/edit-room/:id" element={<EditRoom />} />
            <Route path="/reception" element={<Reception />} />
            <Route
              path="/admin"
              element={
                localStorage.getItem('role') === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
