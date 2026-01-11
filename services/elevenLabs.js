export const generateVoiceRecap = async (text) => {
    console.log('[ElevenLabs] Generated voice recap:', text);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          audioUrl: 'https://example.com/voice-recap.mp3',
          text: text,
        });
      }, 500);
    });
  };