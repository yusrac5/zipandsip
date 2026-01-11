// constants.js
export const CURRENT_USER = {
    username: 'yusrac',
    email: 'yusra.choudhary5@gmail.com',
    avatar: '🍵',
    totalPoints: 645,
    matchaCount: 43,
    streak: 12,
    level: 7,
    monthlySpend: 279.50,
    avgPricePerMatcha: 6.50,
    cheapestSpot: 'JavaTime',
    mostExpensiveSpot: 'The Spoke',
    projectedYearlySpend: 3354,
  };
  
  export const MATCHA_SPOTS = [
    { id: 1, name: "Twins Cafe", lat: 42.9849, lng: -81.2497, address: "1135 Richmond St", activeNow: 3, todayLogs: 8, basePoints: 15, avgPrice: 6.50 },
    { id: 2, name: "The Spoke", lat: 42.9853, lng: -81.2453, address: "1151 Richmond St", activeNow: 5, todayLogs: 12, basePoints: 20, avgPrice: 7.25 },
    { id: 3, name: "JavaTime", lat: 42.9832, lng: -81.2497, address: "171 Queens Ave", activeNow: 2, todayLogs: 6, basePoints: 10, avgPrice: 5.75 },
  ];
  
  export const DRINK_TYPES = [
    { id: 1, name: "Iced Matcha Latte", emoji: "🍵", avgPrice: 6.50 },
    { id: 2, name: "Hot Ceremonial", emoji: "🍵", avgPrice: 7.00 },
    { id: 3, name: "Matcha Frappe", emoji: "🍵", avgPrice: 7.50 },
    { id: 4, name: "Oat Milk Matcha", emoji: "🍵", avgPrice: 6.75 },
  ];
  
  export const MATCHA_IMAGES = [
    'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400',
    'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400',
    'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=400',
  ];
  
  export const FALLBACK_MOMENTS = [
    { _id: '1', username: 'greenteaqueen', drink: 'Iced Matcha Latte', cafe: 'Twins Cafe', points: 15, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), image: MATCHA_IMAGES[0] },
    { _id: '2', username: 'matchaenthusiast', drink: 'Hot Ceremonial Matcha', cafe: 'The Spoke', points: 20, timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), image: MATCHA_IMAGES[1] },
    { _id: '3', username: 'sipmaster', drink: 'Matcha Frappe', cafe: 'JavaTime', points: 10, timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), image: MATCHA_IMAGES[2] },
  ];
  
  export const FALLBACK_CULTURAL_MOMENTS = [
    { _id: 'c1', location: 'Twins Cafe', participationCount: 7, trendType: 'spike', description: '7 people just logged at Twins Cafe! 🔥', timestamp: new Date(Date.now() - 12*60*1000).toISOString() },
    { _id: 'c2', location: 'The Spoke', participationCount: 5, trendType: 'surge', description: 'Peak matcha hour at The Spoke - 5 active now', timestamp: new Date(Date.now() - 28*60*1000).toISOString() },
  ];
  
  export const USERS = [
    { username: 'yusrac', email: 'yusra.choudhary5@gmail.com', password: 'zipandsip', avatar: '🍵' },
    { username: 'umaizaali', email: 'umaizaali@gmail.com', password: 'zipandsip', avatar: '💚' },
  ];
  export const FRIENDS_LEADERBOARD = [
    { rank: 1, username: 'yusrac', points: 645, matchaCount: 43, streak: 12, avatar: '🍵' },
    { rank: 2, username: 'umaizaali', points: 520, matchaCount: 38, streak: 8, avatar: '🍵' },
    { rank: 3, username: 'aliya', points: 410, matchaCount: 31, streak: 15, avatar: '🍵' },
    { rank: 4, username: 'greenteaqueen', points: 385, matchaCount: 29, streak: 6, avatar: '🍵' },
    { rank: 5, username: 'matchaenthusiast', points: 340, matchaCount: 26, streak: 9, avatar: '🍵' },
  ];
  
  export const GLOBAL_LEADERBOARD = [
    { rank: 1, username: 'emilyjane', points: 2845, matchaCount: 312, streak: 89, avatar: '🍵' },
    { rank: 2, username: 'matchalover', points: 2103, matchaCount: 245, streak: 67, avatar: '🍵' },
    { rank: 3, username: 'nycmatchalover', points: 1876, matchaCount: 198, streak: 45, avatar: '🍵' },
    { rank: 4, username: 'josh', points: 1654, matchaCount: 187, streak: 52, avatar: '🍵' },
    { rank: 5, username: 'hunter', points: 1432, matchaCount: 156, streak: 41, avatar: '🍵' },
    { rank: 6, username: 'rachel', points: 1298, matchaCount: 145, streak: 38, avatar: '🍵' },
    { rank: 7, username: 'amna', points: 1145, matchaCount: 134, streak: 29, avatar: '🍵' },
    { rank: 8, username: 'azra', points: 987, matchaCount: 123, streak: 33, avatar: '🍵' },
    { rank: 9, username: 'yusrac', points: 645, matchaCount: 43, streak: 12, avatar: '🍵', isYou: true },
    { rank: 10, username: 'umaizaali', points: 520, matchaCount: 38, streak: 8, avatar: '🍵' },
  ];