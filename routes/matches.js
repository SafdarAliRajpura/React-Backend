const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const User = require('../models/User');

// @route   GET api/matches
// @desc    Get all open matches
// @access  Public (for now)
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find({ status: 'Open' })
      .populate('host', 'fullName avatar')
      .populate('playersJoined', 'fullName avatar')
      .sort({ createdAt: -1 });
    res.json(matches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/matches
// @desc    Create a new match
// @access  Public (should be protected usually)
router.post('/', async (req, res) => {
  const { hostId, sport, venue, date, time, playersTotal, pricePerPerson, description } = req.body;

  try {
    const newMatch = new Match({
      host: hostId,
      sport,
      venue,
      date,
      time,
      playersTotal,
      playersJoined: [hostId], // Host joins automatically
      pricePerPerson,
      description
    });

    const match = await newMatch.save();
    res.json(match);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/matches/:id/join
// @desc    Join a match
// @access  Public
router.put('/:id/join', async (req, res) => {
  const { userId } = req.body;

  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ msg: 'Match not found' });
    }

    // Check if user already joined
    if (match.playersJoined.some(player => player.toString() === userId)) {
      return res.status(400).json({ msg: 'User already joined this match' });
    }

    // Check if full
    if (match.playersJoined.length >= match.playersTotal) {
      return res.status(400).json({ msg: 'Match is full' });
    }

    match.playersJoined.push(userId);

    // Update status if full
    if (match.playersJoined.length >= match.playersTotal) {
      match.status = 'Full';
    }

    await match.save();

    res.json(match);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
