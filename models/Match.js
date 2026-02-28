const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sport: {
    type: String,
    required: true,
    enum: ['Football', 'Cricket', 'Pickleball', 'Badminton']
  },
  venue: {
    type: String, // Can be refined to Ref if we had Venue model, string is fine for now
    required: true
  },
  date: {
    type: String, // Storing as string for simplicity (e.g., "25 Feb") or Date
    required: true
  },
  time: {
    type: String,
    required: true
  },
  playersTotal: {
    type: Number,
    required: true
  },
  playersJoined: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  pricePerPerson: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['Open', 'Full', 'Completed', 'Cancelled'],
    default: 'Open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Match', MatchSchema);
