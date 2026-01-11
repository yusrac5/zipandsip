export const getHistoricalAnalytics = async () => {
    console.log('[Snowflake] Fetched historical participation data');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          weeklyAvg: 50,
          monthlyTrend: 'upward',
          topLocations: ['Twins Cafe', 'The Spoke', 'JavaTime'],
          peakHours: [11, 14, 16],
        });
      }, 500);
    });
  };