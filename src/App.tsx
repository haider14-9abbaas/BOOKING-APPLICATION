import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import HotelDetails from './pages/HotelDetails';
import RoomDetails from './pages/RoomDetails';
import BookingForm from './pages/BookingForm';
import BookingConfirmation from './pages/BookingConfirmation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hotel/:id" element={<HotelDetails />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route path="/booking/:roomId" element={<BookingForm />} />
          <Route path="/confirmation" element={<BookingConfirmation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;