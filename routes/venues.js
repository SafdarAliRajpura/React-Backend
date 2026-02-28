const express = require('express');
const router = express.Router();
const Venue = require('../models/Venue');
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const processImage = (imgStr, req) => {
  if (imgStr && typeof imgStr === 'string' && imgStr.startsWith('data:image')) {
    const matches = imgStr.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
      const base64Data = matches[2];
      const filename = `venue_${Date.now()}_${Math.floor(Math.random()*1000)}.${ext}`;
      const filepath = path.join(__dirname, '../public/uploads', filename);
      // Ensure the directory exists
      if (!fs.existsSync(path.dirname(filepath))) {
         fs.mkdirSync(path.dirname(filepath), { recursive: true });
      }
      fs.writeFileSync(filepath, base64Data, 'base64');
      return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    }
  }
  return imgStr; // Return as is if not a base64 string
};

// @route   GET api/venues
// @desc    Get all venues
// @access  Public (or protected if only logged in users can see)
router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find().populate('owner', 'fullName email');
    res.json(venues);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/venues/my-venues
// @desc    Get venues created by the logged in partner/admin
// @access  Private
router.get('/my-venues', auth, async (req, res) => {
  try {
    const venues = await Venue.find({ owner: req.user.id }).populate('owner', 'fullName email');
    res.json(venues);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/venues/:id
// @desc    Get single venue
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id).populate('owner', 'fullName email');
    if (!venue) return res.status(404).json({ msg: 'Venue not found' });
    res.json(venue);
  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId') return res.status(404).json({ msg: 'Venue not found' });
    res.status(500).send('Server Error');
  }
});

// @route   POST api/venues
// @desc    Create a venue
// @access  Private (for partners/admins)
router.post('/', auth, async (req, res) => {
  const { name, location, price, description, image, images, amenities, courtCount, courtSports } = req.body;

  try {
    const venueFields = {
      name,
      location,
      price,
      owner: req.user.id
    };

    if (description) venueFields.description = description;
    if (courtCount !== undefined) venueFields.courtCount = courtCount;
    if (courtSports !== undefined) venueFields.courtSports = courtSports;

    if (image) venueFields.image = processImage(image, req);
    if (images) {
      venueFields.images = typeof images === 'string' ? [images] : images;
      venueFields.images = venueFields.images.map(img => processImage(img, req));
    }
    if (amenities) venueFields.amenities = amenities;

    const newVenue = new Venue(venueFields);
    const venue = await newVenue.save();
    
    res.json(venue);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/venues/:id
// @desc    Update a venue (e.g. status)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, location, price, description, status, image, images, amenities, courtCount, courtSports } = req.body;

  try {
    let venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ msg: 'Venue not found' });

    // Ensure user owns venue or is super admin
    if (venue.owner.toString() !== req.user.id) {
       // Optional: Add check for superadmin if necessary. Assuming only owner can edit for now.
       return res.status(401).json({ msg: 'Not authorized' });
    }

    const venueFields = {};
    if (name) venueFields.name = name;
    if (location) venueFields.location = location;
    if (price !== undefined) venueFields.price = price;
    if (description) venueFields.description = description;
    if (status) venueFields.status = status;
    if (courtCount !== undefined) venueFields.courtCount = courtCount;
    if (courtSports !== undefined) venueFields.courtSports = courtSports;
    if (image) venueFields.image = processImage(image, req);
    if (images) {
      venueFields.images = typeof images === 'string' ? [images] : images;
      venueFields.images = venueFields.images.map(img => processImage(img, req));
    }
    if (amenities) venueFields.amenities = amenities;

    venue = await Venue.findByIdAndUpdate(
      req.params.id,
      { $set: venueFields },
      { new: true }
    );

    res.json(venue);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/venues/:id
// @desc    Delete a venue
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let venue = await Venue.findById(req.params.id);
        if (!venue) return res.status(404).json({ msg: 'Venue not found' });

        if (venue.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Venue.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Venue removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
