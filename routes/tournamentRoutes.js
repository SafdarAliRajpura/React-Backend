const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');

// GET all tournaments
router.get('/', async (req, res) => {
    try {
        const tournaments = await Tournament.find().sort({ startDate: 1 });
        res.json(tournaments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single tournament by ID
router.get('/:id', async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id);
        if (!tournament) return res.status(404).json({ message: 'Tournament not found' });
        res.json(tournament);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a new tournament (Admin only ideally)
router.post('/', async (req, res) => {
    const { title, game, location, startDate, prizePool, entryFee, maxTeams, image, description } = req.body;

    const tournament = new Tournament({
        title,
        game,
        location,
        startDate,
        prizePool,
        entryFee,
        maxTeams,
        image,
        description
    });

    try {
        const newTournament = await tournament.save();
        res.status(201).json(newTournament);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST Register a Team
router.post('/:id/register', async (req, res) => {
    const { teamName, captainId, memberIds } = req.body;
    
    try {
        const tournament = await Tournament.findById(req.params.id);
        if (!tournament) return res.status(404).json({ msg: 'Tournament not found' });

        if (tournament.registeredTeams.length >= tournament.maxTeams) {
            return res.status(400).json({ msg: 'Tournament is full' });
        }

        // Create new team object (embedded)
        const newTeam = {
            name: teamName,
            captain: captainId,
            members: memberIds || [], // Array of User IDs
            paymentStatus: 'Paid' // Mocking immediate payment for now
        };

        tournament.registeredTeams.push(newTeam);
        await tournament.save();

        res.json(tournament);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT update tournament (for brackets and status)
router.put('/:id', async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id);
        if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

        if (req.body.rounds) tournament.rounds = req.body.rounds;
        if (req.body.status) tournament.status = req.body.status;
        
        const updatedTournament = await tournament.save();
        res.json(updatedTournament);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
