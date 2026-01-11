export const getLiveCultureMoments = async () => {
    console.log('[Cloudflare Worker] Calculated live culture moments');
    
    return [
      { city: 'Toronto', location: 'Twins Cafe', spikeHour: '11:42 AM', participants: 120, trend: 'spike' },
      { city: 'London, ON', location: 'The Spoke', spikeHour: '2:15 PM', participants: 87, trend: 'surge' },
    ];
  };