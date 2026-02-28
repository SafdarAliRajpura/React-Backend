const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Venue = require('../models/Venue');
const auth = require('../middleware/auth');

// GET bookings by filter (turfName, date)
router.get('/filter', async (req, res) => {
  const { turfName, date } = req.query;
  try {
    const query = { status: 'confirmed' };
    if (turfName) query.turfName = turfName;
    if (date) query.date = date;

    const bookings = await Booking.find(query);
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET all bookings for a partner's turfs
router.get('/partner', auth, async (req, res) => {
  try {
    // 1. Find all venues owned by this partner
    const venues = await Venue.find({ owner: req.user.id });
    const venueNames = venues.map(v => v.name);
    
    // 2. Find all bookings that match those venue names
    const bookings = await Booking.find({ turfName: { $in: venueNames } })
                                  .sort({ createdAt: -1 })
                                  .populate('userId', 'fullName email phone');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET all bookings for a user
router.get('/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST create a new booking
router.post('/', async (req, res) => {
  const { userId, turfName, sport, date, timeSlot, price } = req.body;

  try {
    // Check if slot is already booked (optional validation)
    const existing = await Booking.findOne({ turfName, date, timeSlot, status: 'confirmed' });
    if (existing) {
      return res.status(400).json({ msg: 'Slot already booked' });
    }

    const newBooking = new Booking({
      userId,
      turfName,
      sport,
      date,
      timeSlot,
      price
    });

    const savedBooking = await newBooking.save();
    res.json(savedBooking);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
