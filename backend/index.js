// backend/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// IMPORTANT: Apply CORS middleware BEFORE defining routes
app.use(cors({
  origin: '*', // Allow all origins - important for React Native
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: false,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB URI - use environment variable
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://zipandsip:zipandsip@zipandsip.5vev4mp.mongodb.net/zipandsip?retryWrites=true&w=majority';

console.log('Connecting to MongoDB...');

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Schemas
const matchaSchema = new mongoose.Schema({
  drink: String,
  cafe: String,
  points: Number,
  timestamp: { type: Date, default: Date.now },
  user: String,
  location: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  points: { type: Number, default: 0 },
  matchaCount: { type: Number, default: 0 },
  avatar: { type: String, default: '🍵' },
  streak: { type: Number, default: 0 },
});

const culturalMomentSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  location: String,
  participationCount: Number,
  trendType: String, // 'spike', 'surge', 'sustained'
  description: String,
});

const Matcha = mongoose.model('Matcha', matchaSchema);
const User = mongoose.model('User', userSchema);
const CulturalMoment = mongoose.model('CulturalMoment', culturalMomentSchema);

// Gemini AI Integration (optional - only if you have API key)
let generateCulturalInsight = null;
try {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  
  if (process.env.GEMINI_API_KEY) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    generateCulturalInsight = async (data) => {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `Based on this matcha participation data, generate a brief, playful cultural insight (max 25 words):
      - Total logs this week: ${data.weeklyLogs}
      - Peak hour: ${data.peakHour}
      - Top location: ${data.topLocation}
      - Weather: ${data.weather}
      
      Keep it witty, observational, and cultural. No fluff.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    };
  }
} catch (err) {
  console.log('Gemini AI not configured (optional feature)');
}

// Routes
app.get('/', (req, res) => {
  console.log('Root endpoint hit');
  res.json({ message: 'Zip & Sip backend is running!', status: 'ok' });
});

// Log a matcha sip
app.post('/api/log', async (req, res) => {
  try {
    console.log('Log request received:', req.body);
    const { drink, cafe, points, user, location } = req.body;
    
    if (!drink || !cafe || !points) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newSip = new Matcha({ drink, cafe, points, user, location });
    await newSip.save();

    if (user) {
      let dbUser = await User.findOne({ username: user });
      if (!dbUser) {
        dbUser = new User({ username: user, points, matchaCount: 1 });
      } else {
        dbUser.points += points;
        dbUser.matchaCount += 1;
      }
      await dbUser.save();
    }

    console.log('Sip logged successfully:', newSip);
    res.status(201).json(newSip);
  } catch (err) {
    console.error('Error logging sip:', err);
    res.status(500).json({ error: 'Failed to log matcha sip', details: err.message });
  }
});

// Fetch recent sips
app.get('/api/matcha', async (req, res) => {
  try {
    console.log('Fetching matcha sips...');
    const sips = await Matcha.find().sort({ timestamp: -1 }).limit(20);
    console.log(`Found ${sips.length} sips`);
    res.json(sips);
  } catch (err) {
    console.error('Error fetching sips:', err);
    res.status(500).json({ error: 'Failed to fetch matcha sips', details: err.message });
  }
});

// Fetch leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    console.log('Fetching leaderboard...');
    const leaderboard = await User.find().sort({ points: -1 }).limit(10);
    console.log(`Leaderboard fetched: ${leaderboard.length} users`);
    res.json(leaderboard);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard', details: err.message });
  }
});

// Fetch cultural moments
app.get('/api/cultural-moments', async (req, res) => {
  try {
    console.log('Fetching cultural moments...');
    const moments = await CulturalMoment.find()
      .sort({ timestamp: -1 })
      .limit(10);
    res.json(moments);
  } catch (err) {
    console.error('Error fetching cultural moments:', err);
    res.status(500).json({ error: 'Failed to fetch cultural moments', details: err.message });
  }
});

// Generate weekly insight with Gemini (fallback if no API key)
app.get('/api/weekly-insight', async (req, res) => {
  try {
    console.log('Generating weekly insight...');
    
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyLogs = await Matcha.countDocuments({
      timestamp: { $gte: weekAgo }
    });
    
    const weeklyData = {
      weeklyLogs,
      peakHour: "11:42 AM",
      topLocation: "NYC",
      weather: "Cold"
    };
    
    let insight;
    if (generateCulturalInsight) {
      insight = await generateCulturalInsight(weeklyData);
    } else {
      // Fallback insights
      const fallbacks = [
        "Toronto showed up hard for matcha this week — peak participation hit at 11:42 AM. 🍵",
        "Cold weather = hot matcha energy. This week's participation spiked during the afternoon slump.",
        "Morning matcha is having a moment. 67% of logs happened before noon this week.",
        "The collective is vibing. Participation consistency is up 23% from last week.",
      ];
      insight = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
    
    res.json({ insight, weeklyLogs });
  } catch (err) {
    console.error('Error generating insight:', err);
    res.json({ 
      insight: "The matcha momentum is real. Peak participation continues to align with the collective rhythm.",
      weeklyLogs: 0
    });
  }
});

// 404 handler
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.url);
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 For React Native, use: http://YOUR_IP_ADDRESS:${PORT}`);
  console.log(`🌐 For web, use: http://localhost:${PORT}`);
});