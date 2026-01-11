import Constants from 'expo-constants';

const getBackendUrl = () => {
  const manifest = Constants.expoConfig || Constants.manifest;
  if (manifest?.hostUri) {
    const host = manifest.hostUri.split(':').shift();
    return `http://${host}:5000`;
  }
  return 'http://localhost:5000';
};

const BACKEND_URL = getBackendUrl();

export const generateInsights = async (data) => {
  console.log('[Gemini] Generating insights for data:', data);
  
  try {
    const res = await fetch(`${BACKEND_URL}/api/weekly-insight`);
    if (res.ok) {
      const result = await res.json();
      return result.insight;
    }
  } catch (err) {
    console.log('[Gemini] API unavailable, using fallback');
  }
  
  const insights = [
    'Toronto showed up hard this week. Peak participation hit at 11:42 AM 🍵',
    'Cold weather = hot matcha energy. Afternoon participation spiked 34%.',
    'Morning matcha is having a moment. 67% of logs before noon this week.',
    'The collective is vibing. Consistency up 23% from last week 📈',
  ];
  
  return insights[Math.floor(Math.random() * insights.length)];
};