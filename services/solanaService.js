export const mintTopPerformerNFT = async (userId) => {
    console.log('[Solana] Minting Top Performer NFT for:', userId);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          nftId: `NFT-${Date.now()}`,
          user: userId,
          blockchain: 'Solana',
          mintedAt: new Date().toISOString(),
        });
      }, 1000);
    });
  };