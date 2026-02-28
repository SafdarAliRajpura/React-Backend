const mongoose = require('mongoose');
const Tournament = require('../models/Tournament');
require('dotenv').config();

const seedTournaments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/football_turf');
    console.log('MongoDB Connected');

    const tournaments = [
      {
        title: "Ahmedabad Football League 2026",
        game: "Football",
        location: "Kick Off Turf, Ahmedabad",
        startDate: new Date("2026-03-15"),
        endDate: new Date("2026-03-20"),
        status: "Open",
        maxTeams: 16,
        prizePool: "₹50,000",
        entryFee: 3000,
        description: "The biggest 5v5 football tournament in the city. Prove your mettle and take home the cup!",
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000",
        rules: ["Knockout Format", "5 Main + 3 Subs", "20 Mins Halves"],
        registeredTeams: []
      },
      {
        title: "Super Sixes Cricket Cup",
        game: "Cricket",
        location: "Box Cricket Arena, Ahmedabad",
        startDate: new Date("2026-04-10"),
        endDate: new Date("2026-04-12"),
        status: "Open",
        maxTeams: 8,
        prizePool: "₹25,000",
        entryFee: 1500,
        description: "Fast-paced Box Cricket action. 6 Overs per side. Powerplay rules apply.",
        image: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?q=80&w=1000",
        rules: ["6 Overs / Innings", "Powerplay 1 Over", "No LBW"],
        registeredTeams: []
      },
      {
        title: "Smash Badminton Masters",
        game: "Badminton",
        location: "Smash Zone, Satellite",
        startDate: new Date("2026-05-01"),
        status: "Open",
        maxTeams: 32,
        prizePool: "₹10,000",
        entryFee: 500,
        description: "Doubles tournament for amateur players. Group stage followed by knockouts.",
        image: "https://images.unsplash.com/photo-1626224583764-847890e058f5?q=80&w=1000",
        rules: ["Doubles Only", "21 Points Best of 3"],
        registeredTeams: []
      }
    ];

    await Tournament.insertMany(tournaments);
    console.log('✅ Tournament Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error Seeding Data:', error);
    process.exit(1);
  }
};

seedTournaments();
