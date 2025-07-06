import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Hotel Schema
const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 4.5 },
  amenities: [String],
  priceRange: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Room Schema
const roomSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  amenities: [String],
  images: [String],
  available: { type: Boolean, default: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Booking Schema
const bookingSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  customerDetails: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    specialRequests: { type: String, default: '' }
  },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  guests: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Cash on Delivery' },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' },
  createdAt: { type: Date, default: Date.now }
});

const Hotel = mongoose.model('Hotel', hotelSchema);
const Room = mongoose.model('Room', roomSchema);
const Booking = mongoose.model('Booking', bookingSchema);

// Seed data
async function seedData() {
  try {
    const hotelCount = await Hotel.countDocuments();
    if (hotelCount === 0) {
      const hotels = [
        {
          name: "The Grand Palace Hotel",
          location: "New York, USA",
          description: "A luxurious 5-star hotel in the heart of Manhattan with stunning city views and world-class amenities.",
          image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          rating: 4.8,
          amenities: ["Free WiFi", "Swimming Pool", "Spa", "Fitness Center", "Restaurant", "Room Service"],
          priceRange: "$200 - $500"
        },
        {
          name: "Seaside Resort & Spa",
          location: "Miami, USA",
          description: "Beachfront resort with pristine white sand beaches and crystal-clear waters.",
          image: "https://images.pexels.com/photos/2417842/pexels-photo-2417842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          rating: 4.7,
          amenities: ["Private Beach", "Spa", "Pool Bar", "Water Sports", "Fine Dining", "Concierge"],
          priceRange: "$150 - $400"
        },
        {
          name: "Mountain View Lodge",
          location: "Aspen, USA",
          description: "Cozy mountain lodge with breathtaking views and world-class skiing facilities.",
          image: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          rating: 4.6,
          amenities: ["Ski Access", "Fireplace", "Mountain Views", "Hot Tub", "Restaurant", "Hiking Trails"],
          priceRange: "$120 - $300"
        }
      ];

      const createdHotels = await Hotel.insertMany(hotels);
      
      const rooms = [
        // Grand Palace Hotel rooms
        {
          hotelId: createdHotels[0]._id,
          type: "Deluxe King Room",
          price: 250,
          capacity: 2,
          amenities: ["King Bed", "City View", "Mini Bar", "Work Desk", "Marble Bathroom"],
          images: ["https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
          description: "Spacious king room with stunning city views and premium amenities."
        },
        {
          hotelId: createdHotels[0]._id,
          type: "Executive Suite",
          price: 450,
          capacity: 4,
          amenities: ["Separate Living Area", "Panoramic Views", "Premium Bedding", "Kitchenette", "Concierge Access"],
          images: ["https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
          description: "Luxurious suite with separate living area and panoramic city views."
        },
        // Seaside Resort rooms
        {
          hotelId: createdHotels[1]._id,
          type: "Ocean View Room",
          price: 200,
          capacity: 2,
          amenities: ["Ocean View", "Balcony", "Beach Access", "Tropical Decor", "Mini Fridge"],
          images: ["https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
          description: "Beautiful ocean view room with private balcony and direct beach access."
        },
        {
          hotelId: createdHotels[1]._id,
          type: "Beachfront Villa",
          price: 380,
          capacity: 6,
          amenities: ["Private Beach", "Full Kitchen", "Multiple Bedrooms", "Outdoor Patio", "BBQ Area"],
          images: ["https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
          description: "Spacious beachfront villa perfect for families and groups."
        },
        // Mountain View Lodge rooms
        {
          hotelId: createdHotels[2]._id,
          type: "Mountain View Room",
          price: 150,
          capacity: 2,
          amenities: ["Mountain Views", "Fireplace", "Rustic Decor", "Ski Storage", "Heated Floors"],
          images: ["https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
          description: "Cozy room with stunning mountain views and rustic charm."
        },
        {
          hotelId: createdHotels[2]._id,
          type: "Alpine Suite",
          price: 280,
          capacity: 4,
          amenities: ["Panoramic Views", "Jacuzzi", "Fireplace", "Ski-in/Ski-out", "Kitchenette"],
          images: ["https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"],
          description: "Luxury alpine suite with panoramic mountain views and premium amenities."
        }
      ];

      await Room.insertMany(rooms);
      console.log('Sample data created successfully!');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// API Routes
app.get('/api/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/hotels/:id/rooms', async (req, res) => {
  try {
    const rooms = await Room.find({ hotelId: req.params.id });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotelId');
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('hotelId roomId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize database and start server
mongoose.connection.once('open', async () => {
  console.log('Connected to MongoDB');
  await seedData();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});