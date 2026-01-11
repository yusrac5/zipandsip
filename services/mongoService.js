import Constants from 'expo-constants';
import { CURRENT_USER, FALLBACK_MOMENTS } from '../constants';

const getBackendUrl = () => {
  const manifest = Constants.expoConfig || Constants.manifest;
  if (manifest?.hostUri) {
    const host = manifest.hostUri.split(':').shift();
    return `http://${host}:5000`;
  }
  return 'http://localhost:5000';
};

const BACKEND_URL = getBackendUrl();

export const getUserProfile = async (userId) => {
  console.log('[MongoDB] Fetching user profile:', userId);
  
  try {
    const res = await fetch(`${BACKEND_URL}/api/user/${userId}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.log('[MongoDB] Using fallback user data');
  }
  
  return CURRENT_USER;
};

export const getMatchaMoments = async () => {
  console.log('[MongoDB] Fetching matcha moments');
  
  try {
    const res = await fetch(`${BACKEND_URL}/api/matcha`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) return data;
    }
  } catch (err) {
    console.log('[MongoDB] Using fallback moments');
  }
  
  return FALLBACK_MOMENTS;
};

export const logMatchaMoment = async (momentData) => {
  console.log('[MongoDB] Logging matcha moment:', momentData);
  
  try {
    const res = await fetch(`${BACKEND_URL}/api/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(momentData),
    });
    
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.log('[MongoDB] Log failed, using local update');
  }
  
  return { success: true, localOnly: true };
};