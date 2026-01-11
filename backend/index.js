// backend/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow all origins
app.use(express.json());

console.log('MONGO_URI:', process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Schemas
const matchaSchema = new mongoose.Schema({
  drink: String,
  cafe: String,
  points: Number,
  timestamp: { type: Date, default: Date.now },
  user: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  points: { type: Number, default: 0 },
  matchaCount: { type: Number, default: 0 },
});

const Matcha = mongoose.model('Matcha', matchaSchema);
const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => res.send('Zip & Sip backend is running!'));

// Log a matcha sip
app.post('/api/log', async (req, res) => {
  try {
    const { drink, cafe, points, user } = req.body;
    const newSip = new Matcha({ drink, cafe, points, user });
    await newSip.save();

    if (user) {
      let dbUser = await User.findOne({ username: user });
      if (!dbUser) dbUser = new User({ username: user, points, matchaCount: 1 });
      else {
        dbUser.points += points;
        dbUser.matchaCount += 1;
      }
      await dbUser.save();
    }

    res.status(201).json(newSip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log matcha sip' });
  }
});

// Fetch recent sips
app.get('/api/matcha', async (req, res) => {
  try {
    const sips = await Matcha.find().sort({ timestamp: -1 }).limit(20);
    res.json(sips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch matcha sips' });
  }
});

// Fetch leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find().sort({ points: -1 }).limit(10);
    console.log('Leaderboard fetched:', leaderboard);
    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));