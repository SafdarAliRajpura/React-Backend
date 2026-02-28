const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// --- TEAM SCHEMA (Registered Teams) ---
const TeamSchema = new Schema({
    name: { type: String, required: true },
    captain: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    // track payments or verification status
    paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    matchesWon: { type: Number, default: 0 },
    matchesLost: { type: Number, default: 0 },
});

// --- TOURNAMENT SCHEMA ---
const TournamentSchema = new Schema({
    title: { type: String, required: true },
    game: { type: String, required: true }, // e.g. Football, Cricket
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    
    // Status
    status: { type: String, enum: ['Open', 'Ongoing', 'Completed'], default: 'Open' },

    // Format & Courts
    format: { type: String, default: 'Knockout' },
    courts: { type: Number, default: 1 },

    // Capacity
    maxTeams: { type: Number, default: 16 },
    registeredTeams: [TeamSchema], // Embedded teams or reference

    // Prize Pool
    prizePool: { type: String, required: true }, // e.g. "₹50,000"
    entryFee: { type: Number, required: true },

    // Rules & Info
    description: { type: String },
    rules: [{ type: String }],
    
    // Bracket / Matches (Simplified for now)
    rounds: [{
        name: { type: String }, // e.g. "Quarter Finals"
        matches: [{
            teamA: { type: String },
            teamB: { type: String },
            scoreA: { type: Number },
            scoreB: { type: Number },
            winner: { type: String }
        }]
    }],

    image: { type: String } // Banner image URL
}, { timestamps: true });

module.exports = mongoose.model('Tournament', TournamentSchema);
