const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'MAINTENANCE'],
    default: 'ACTIVE'
  },
  courtCount: {
    type: Number,
    default: 1
  },
  courtSports: [{
    type: String
  }],
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1574629810360-7efbb1925713?q=80&w=600'
  },
  images: [{
    type: String
  }],
  amenities: [{
    type: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Venue', VenueSchema);
