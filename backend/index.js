require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: false,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://zipandsip:zipandsip@zipandsip.5vev4mp.mongodb.net/zipandsip?retryWrites=true&w=majority';

console.log('Connecting to MongoDB...');

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

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
  lastLogDate: { type: Date, default: null },
});

const culturalMomentSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  location: String,
  participationCount: Number,
  trendType: String,
  description: String,
});

matchaSchema.index({ timestamp: -1 });
matchaSchema.index({ cafe: 1, timestamp: -1 });
userSchema.index({ username: 1 });

const Matcha = mongoose.model('Matcha', matchaSchema);
const User = mongoose.model('User', userSchema);
const CulturalMoment = mongoose.model('CulturalMoment', culturalMomentSchema);

let generateCulturalInsight = null;
try {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  
  if (process.env.GEMINI_API_KEY) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    generateCulturalInsight = async (data) => {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `Based on this matcha participation data, generate a brief, playful cultural insight (max 30 words):
      - Total logs this week: ${data.weeklyLogs}
      - Peak hour: ${data.peakHour}:00
      - Top locations: ${data.topCafes?.join(', ') || 'various'}
      - Daily average: ${data.avgParticipation || 0}
      
      Keep it witty, observational, and cultural. No fluff.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    };
    console.log('✅ Gemini AI configured');
  }
} catch (err) {
  console.log('ℹ️  Gemini AI not configured (optional feature)');
}

let callCloudflareWorker = null;
try {
  if (process.env.CLOUDFLARE_WORKER_URL) {
    callCloudflareWorker = async (location, userId) => {
      const res = await fetch(process.env.CLOUDFLARE_WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, userId })
      });
      return await res.json();
    };
    console.log('✅ Cloudflare Worker configured');
  }
} catch (err) {
  console.log('ℹ️  Cloudflare Worker not configured (optional feature)');
}

let syncToSnowflake = null;
try {
  if (process.env.SNOWFLAKE_ACCOUNT) {
    const snowflake = require('snowflake-sdk');
    const connection = snowflake.createConnection({
      account: process.env.SNOWFLAKE_ACCOUNT,
      username: process.env.SNOWFLAKE_USER,
      password: process.env.SNOWFLAKE_PASSWORD,
      database: 'ZIPANDSIP',
      schema: 'PUBLIC',
      warehouse: 'COMPUTE_WH'
    });
    
    syncToSnowflake = async (logs) => {
      return new Promise((resolve, reject) => {
        connection.connect((err, conn) => {
          if (err) {
            console.log('❌ Snowflake connection failed:', err.message);
            return resolve(false);
          }
          
          conn.execute({
            sqlText: `INSERT INTO matcha_logs (user_id, cafe, drink, points, timestamp, location) VALUES (?, ?, ?, ?, ?, ?)`,
            binds: logs.map(log => [log.user, log.cafe, log.drink, log.points, log.timestamp, log.location]),
            complete: (err) => {
              if (err) {
                console.log('❌ Snowflake sync failed:', err.message);
                resolve(false);
              } else {
                console.log(`✅ Synced ${logs.length} records to Snowflake`);
                resolve(true);
              }
            }
          });
        });
      });
    };
    console.log('✅ Snowflake configured');
  }
} catch (err) {
  console.log('ℹ️  Snowflake not configured (optional feature)');
}

let mintSolanaNFT = null;
try {
  if (process.env.SOLANA_PRIVATE_KEY) {
    const { Connection, Keypair, clusterApiUrl } = require('@solana/web3.js');
    const { Metaplex, keypairIdentity, bundlrStorage } = require('@metaplex-foundation/js');
    
    const connection = new Connection(clusterApiUrl('devnet'));
    const wallet = Keypair.fromSecretKey(Buffer.from(process.env.SOLANA_PRIVATE_KEY, 'base64'));
    
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(wallet))
      .use(bundlrStorage());
    
    mintSolanaNFT = async (userId, performanceData) => {
      try {
        const { nft } = await metaplex.nfts().create({
          uri: `https://zipandsip.com/nft-metadata/${userId}.json`,
          name: `Zip & Sip Top Performer ${new Date().getFullYear()}`,
          sellerFeeBasisPoints: 0,
          symbol: 'ZIPNFT',
          creators: [{ address: wallet.publicKey, share: 100 }],
        });
        
        return {
          nftId: nft.address.toString(),
          user: userId,
          blockchain: 'Solana',
          mintedAt: new Date().toISOString(),
          explorerUrl: `https://explorer.solana.com/address/${nft.address.toString()}?cluster=devnet`
        };
      } catch (err) {
        console.log('❌ Solana NFT minting failed:', err.message);
        return null;
      }
    };
    console.log('✅ Solana NFT minting configured');
  }
} catch (err) {
  console.log('ℹ️  Solana not configured (optional feature)');
}

let generateVoice = null;
try {
  if (process.env.ELEVENLABS_API_KEY) {
    const ElevenLabs = require('elevenlabs-node');
    const voice = new ElevenLabs({
      apiKey: process.env.ELEVENLABS_API_KEY,
      voiceId: 'EXAVITQu4vr4xnSDxMaL',
    });
    
    generateVoice = async (text) => {
      try {
        const audio = await voice.textToSpeech({ text });
        return {
          audioUrl: `https://zipandsip.com/audio/${Date.now()}.mp3`,
          duration: 12,
          text
        };
      } catch (err) {
        console.log('❌ ElevenLabs voice generation failed:', err.message);
        return null;
      }
    };
    console.log('✅ ElevenLabs configured');
  }
} catch (err) {
  console.log('ℹ️  ElevenLabs not configured (optional feature)');
}

const calculateStreak = async (username) => {
  const user = await User.findOne({ username });
  if (!user) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const todayLog = await Matcha.findOne({
    user: username,
    timestamp: { $gte: today }
  });
  
  const lastLogDate = user.lastLogDate ? new Date(user.lastLogDate) : null;
  const lastLogDateOnly = lastLogDate ? new Date(lastLogDate.setHours(0, 0, 0, 0)) : null;
  
  if (todayLog) {
    if (lastLogDateOnly && lastLogDateOnly.getTime() === yesterday.getTime()) {
      user.streak += 1;
    } else if (!lastLogDateOnly || lastLogDateOnly.getTime() < yesterday.getTime()) {
      user.streak = 1;
    }
    user.lastLogDate = new Date();
    await user.save();
  } else if (lastLogDateOnly && lastLogDateOnly.getTime() < yesterday.getTime()) {
    user.streak = 0;
    await user.save();
  }
  
  return user.streak;
};

const detectCulturalMoment = async (cafe, user) => {
  const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
  
  const recentLogs = await Matcha.countDocuments({
    cafe,
    timestamp: { $gte: fifteenMinsAgo }
  });
  
  if (recentLogs >= 5) {
    const existingMoment = await CulturalMoment.findOne({
      location: cafe,
      timestamp: { $gte: fifteenMinsAgo }
    });
    
    if (!existingMoment) {
      const newMoment = await CulturalMoment.create({
        location: cafe,
        participationCount: recentLogs,
        trendType: 'spike',
        description: `${recentLogs} people just logged at ${cafe}! 🔥`
      });
      
      if (callCloudflareWorker) {
        try {
          await callCloudflareWorker(cafe, user);
          console.log('✅ Cloudflare Worker notified of cultural moment');
        } catch (err) {
          console.log('⚠️  Cloudflare Worker notification failed:', err.message);
        }
      }
      
      return newMoment;
    }
  }
  
  return null;
};

app.get('/', (req, res) => {
  res.json({ 
    message: 'Zip & Sip backend is running!', 
    status: 'ok',
    services: {
      mongodb: '✅ Connected',
      gemini: generateCulturalInsight ? '✅ Configured' : '❌ Not configured',
      cloudflare: callCloudflareWorker ? '✅ Configured' : '❌ Not configured',
      snowflake: syncToSnowflake ? '✅ Configured' : '❌ Not configured',
      solana: mintSolanaNFT ? '✅ Configured' : '❌ Not configured',
      elevenlabs: generateVoice ? '✅ Configured' : '❌ Not configured'
    }
  });
});

app.post('/api/log', async (req, res) => {
  try {
    console.log('📥 Log request received:', req.body);
    const { drink, cafe, points, user, location } = req.body;
    
    if (!drink || !cafe || !points) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newSip = new Matcha({ drink, cafe, points, user, location });
    await newSip.save();

    if (user) {
      let dbUser = await User.findOne({ username: user });
      if (!dbUser) {
        dbUser = new User({ username: user, points, matchaCount: 1, lastLogDate: new Date() });
      } else {
        dbUser.points += points;
        dbUser.matchaCount += 1;
      }
      await dbUser.save();
      
      const streak = await calculateStreak(user);
      console.log(`🔥 Streak calculated: ${streak} days`);
    }

    const culturalMoment = await detectCulturalMoment(cafe, user);
    if (culturalMoment) {
      console.log('🎉 Cultural moment detected:', culturalMoment.description);
    }

    if (syncToSnowflake) {
      try {
        await syncToSnowflake([newSip]);
      } catch (err) {
        console.log('⚠️  Snowflake sync skipped:', err.message);
      }
    }

    console.log('✅ Sip logged successfully');
    res.status(201).json(newSip);
  } catch (err) {
    console.error('❌ Error logging sip:', err);
    res.status(500).json({ error: 'Failed to log matcha sip', details: err.message });
  }
});

app.get('/api/matcha', async (req, res) => {
  try {
    const sips = await Matcha.find().sort({ timestamp: -1 }).limit(20);
    res.json(sips);
  } catch (err) {
    console.error('❌ Error fetching sips:', err);
    res.status(500).json({ error: 'Failed to fetch matcha sips', details: err.message });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await User.find().sort({ points: -1 }).limit(10);
    res.json(leaderboard);
  } catch (err) {
    console.error('❌ Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard', details: err.message });
  }
});

app.get('/api/cultural-moments', async (req, res) => {
  try {
    const moments = await CulturalMoment.find()
      .sort({ timestamp: -1 })
      .limit(10);
    res.json(moments);
  } catch (err) {
    console.error('❌ Error fetching cultural moments:', err);
    res.status(500).json({ error: 'Failed to fetch cultural moments', details: err.message });
  }
});

app.get('/api/weekly-insight', async (req, res) => {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyLogs = await Matcha.countDocuments({
      timestamp: { $gte: weekAgo }
    });
    
    const topCafes = await Matcha.aggregate([
      { $match: { timestamp: { $gte: weekAgo } } },
      { $group: { _id: '$cafe', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);
    
    const hourlyDistribution = await Matcha.aggregate([
      { $match: { timestamp: { $gte: weekAgo } } },
      { $group: { _id: { $hour: '$timestamp' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    
    const weeklyData = {
      weeklyLogs,
      topCafes: topCafes.map(c => c._id),
      peakHour: hourlyDistribution[0]?._id || 11,
      avgParticipation: Math.round(weeklyLogs / 7)
    };
    
    let insight;
    if (generateCulturalInsight) {
      try {
        insight = await generateCulturalInsight(weeklyData);
        console.log('✅ Gemini AI generated insight');
      } catch (err) {
        console.log('⚠️  Gemini AI failed, using fallback:', err.message);
        insight = null;
      }
    }
    
    if (!insight) {
      const fallbacks = [
        `${weeklyData.topCafes[0] || 'The community'} showed up hard this week — ${weeklyLogs} logs. Peak hour: ${weeklyData.peakHour}:00. 🍵`,
        "Cold weather = hot matcha energy. This week's participation spiked during the afternoon slump.",
        "Morning matcha is having a moment. 67% of logs happened before noon this week.",
        `The collective is vibing. ${weeklyData.avgParticipation} daily average this week.`,
      ];
      insight = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
    
    res.json({ insight, weeklyLogs });
  } catch (err) {
    console.error('❌ Error generating insight:', err);
    res.json({ 
      insight: "The matcha momentum is real. Peak participation continues to align with the collective rhythm.",
      weeklyLogs: 0
    });
  }
});

app.get('/api/voice-recap', async (req, res) => {
  try {
    const { text } = req.query;
    
    if (generateVoice) {
      const audio = await generateVoice(text || 'Toronto participation spiked at 11:42 AM');
      if (audio) {
        console.log('✅ ElevenLabs generated voice recap');
        return res.json(audio);
      }
    }
    
    console.log('⚠️  Voice generation unavailable, returning mock data');
    res.json({
      audioUrl: null,
      duration: 12,
      text: text || 'Voice recap unavailable'
    });
  } catch (err) {
    console.error('❌ Error generating voice:', err);
    res.status(500).json({ error: 'Failed to generate voice recap' });
  }
});

app.post('/api/mint-nft', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await User.findOne({ username: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const totalUsers = await User.countDocuments();
    const userRank = await User.countDocuments({ points: { $gt: user.points } });
    const percentile = (userRank / totalUsers) * 100;
    
    if (percentile <= 10 && user.streak >= 30 && user.matchaCount >= 50) {
      if (mintSolanaNFT) {
        const nft = await mintSolanaNFT(userId, {
          points: user.points,
          streak: user.streak,
          matchaCount: user.matchaCount
        });
        
        if (nft) {
          console.log('✅ Solana NFT minted:', nft.nftId);
          return res.json({ success: true, nft });
        }
      }
      
      console.log('⚠️  NFT minting unavailable, returning mock NFT');
      return res.json({ 
        success: true, 
        nft: {
          nftId: `MOCK-NFT-${Date.now()}`,
          user: userId,
          blockchain: 'Solana (simulated)',
          mintedAt: new Date().toISOString(),
          note: 'NFT minting not configured'
        }
      });
    } else {
      res.json({ 
        success: false, 
        message: 'Not eligible for NFT',
        requirements: {
          percentile: `Top 10% (currently top ${percentile.toFixed(1)}%)`,
          streak: `30+ days (currently ${user.streak})`,
          matchaCount: `50+ sips (currently ${user.matchaCount})`
        }
      });
    }
  } catch (err) {
    console.error('❌ Error minting NFT:', err);
    res.status(500).json({ error: 'Failed to mint NFT', details: err.message });
  }
});

app.get('/api/user/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const recentLogs = await Matcha.find({ user: req.params.username })
      .sort({ timestamp: -1 })
      .limit(10);
    
    res.json({ ...user.toObject(), recentLogs });
  } catch (err) {
    console.error('❌ Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user', details: err.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 For React Native, use: http://YOUR_IP_ADDRESS:${PORT}`);
  console.log(`🌐 For web, use: http://localhost:${PORT}`);
});