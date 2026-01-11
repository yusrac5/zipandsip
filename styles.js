import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, TextInput, Image, Platform, Linking, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Constants from 'expo-constants';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { styles } from './styles';

// ====================
// Mock Service Imports
// ====================
import { getUserProfile, getMatchaMoments } from './services/mongoService';
import { mintTopPerformerNFT } from './services/solanaService';
import { getLiveCultureMoments } from './services/cultureWorker';
import { getHistoricalAnalytics } from './services/snowflakeService';
import { generateInsights } from './services/geminiService';
import { generateVoiceRecap } from './services/elevenLabs';

const Tab = createBottomTabNavigator();

// ----------------
// Backend Setup
// ----------------
const getBackendUrl = () => {
  const manifest = Constants.expoConfig || Constants.manifest;
  if (manifest?.hostUri) {
    const host = manifest.hostUri.split(':').shift();
    return `http://${host}:5000`;
  }
  return 'http://localhost:5000';
};

const BACKEND_URL = getBackendUrl();

// ----------------
// Hardcoded Data
// ----------------
const MATCHA_SPOTS = [
  { id: 1, name: "Twins Cafe", lat: 42.9849, lng: -81.2497, address: "1135 Richmond St, London, ON N6A 2K5", activeNow: 3, todayLogs: 8 },
  { id: 2, name: "The Spoke", lat: 42.9853, lng: -81.2453, address: "1151 Richmond St, London, ON N6A 3K7", activeNow: 5, todayLogs: 12 },
  { id: 3, name: "JavaTime", lat: 42.9832, lng: -81.2497, address: "171 Queens Ave #100, London, ON N6A 1J1", activeNow: 2, todayLogs: 6 },
];

const MATCHA_IMAGES = [
  'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400',
  'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400',
  'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=400',
  'https://images.unsplash.com/photo-1563822249366-3efb03fbde7d?w=400',
];

const CURRENT_USER = {
  username: 'matchaenthusiast',
  email: 'matcha@zipandsip.com',
  avatar: '🍵',
  totalPoints: 645,
  matchaCount: 43,
  streak: 12,
  level: 7,
};

const FALLBACK_MOMENTS = [
  { _id: '1', username: 'greenteaqueen', drink: 'Iced Matcha Latte', cafe: 'Twins Cafe', points: 15, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), image: MATCHA_IMAGES[0] },
  { _id: '2', username: 'matchaenthusiast', drink: 'Hot Ceremonial Matcha', cafe: 'The Spoke', points: 20, timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), image: MATCHA_IMAGES[1] },
  { _id: '3', username: 'sipmaster', drink: 'Matcha Frappe', cafe: 'JavaTime', points: 10, timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), image: MATCHA_IMAGES[2] },
  { _id: '4', username: 'teatime', drink: 'Matcha w/ Oat Milk', cafe: 'Twins Cafe', points: 15, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), image: MATCHA_IMAGES[3] },
];

// ----------------
// Login Screen
// ----------------
function LoginScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleAuth = () => {
    navigation.replace('MainApp');
  };

  return (
    <View style={styles.authContainer}>
      <View style={styles.authBox}>
        <Text style={styles.authLogo}>🍵</Text>
        <Text style={styles.authTitle}>Zip & Sip</Text>
        <Text style={styles.authSubtitle}>Matcha moments, measured</Text>

        {!isLogin && (
          <TextInput
            style={styles.authInput}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        )}
        
        <TextInput
          style={styles.authInput}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.authInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
          <Text style={styles.authButtonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.authSwitch}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ----------------
// Feed Screen
// ----------------
function FeedScreen() {
  const [moments, setMoments] = useState([]);

  useEffect(() => {
    async function fetchMoments() {
      try {
        // Fetch from MongoDB
        const mongoMoments = await getMatchaMoments();
        setMoments(mongoMoments || FALLBACK_MOMENTS);

        // Generate AI insights (Gemini)
        const insight = await generateInsights(mongoMoments || FALLBACK_MOMENTS);
        console.log('[Gemini Insight]', insight);

        // Fetch live culture moments (Cloudflare Worker)
        const cultureMoments = await getLiveCultureMoments();
        console.log('[Live Culture Moments]', cultureMoments);

        // Analytics (Snowflake)
        const historical = await getHistoricalAnalytics();
        console.log('[Snowflake Analytics]', historical);

      } catch (err) {
        console.log('Error fetching moments:', err);
        setMoments(FALLBACK_MOMENTS);
      }
    }
    fetchMoments();
  }, []);

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffHours < 1) return 'just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.feedHeader}>
        <Text style={styles.feedHeaderTitle}>Matcha Moments</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {moments.map((moment) => (
          <View key={moment._id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postUserInfo}>
                <View style={styles.postAvatar}>
                  <Text style={styles.postAvatarText}>🍵</Text>
                </View>
                <View>
                  <Text style={styles.postUsername}>@{moment.username}</Text>
                  <Text style={styles.postLocation}>{moment.cafe}</Text>
                </View>
              </View>
              <Text style={styles.postTime}>{getTimeAgo(moment.timestamp)}</Text>
            </View>

            <Image 
              source={{ uri: moment.image || MATCHA_IMAGES[0] }}
              style={styles.postImage}
              resizeMode="cover"
            />

            <View style={styles.postFooter}>
              <Text style={styles.postDrink}>{moment.drink}</Text>
              <View style={styles.postPoints}>
                <Text style={styles.postPointsText}>+{moment.points} pts</Text>
              </View>
            </View>
          </View>
        ))}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ElevenLabs Voice Recap */}
      <TouchableOpacity
        style={styles.authButton}
        onPress={async () => {
          try {
            const recapFile = await generateVoiceRecap('Toronto participation spiked at 11:42 AM');
            console.log('[ElevenLabs Voice Recap]', recapFile);
            Alert.alert('Voice recap generated! Check console for demo.');
          } catch {
            Alert.alert('Voice recap failed (demo only).');
          }
        }}
      >
        <Text style={styles.authButtonText}>Play Culture Recap</Text>
      </TouchableOpacity>
    </View>
  );
}

// ----------------
// Map Screen
// ----------------
function MapScreen() {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = React.useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      } catch (err) {
        console.log('Location error:', err);
      }
    })();
  }, []);

  const handleGetDirections = (spot) => {
    const url = Platform.OS === 'ios'
      ? `maps:0,0?q=${spot.name}@${spot.lat},${spot.lng}`
      : `geo:0,0?q=${spot.lat},${spot.lng}(${spot.name})`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 42.9849,
          longitude: -81.2497,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={!!userLocation}
      >
        {MATCHA_SPOTS.map(spot => (
          <Marker
            key={spot.id}
            coordinate={{ latitude: spot.lat, longitude: spot.lng }}
            onPress={() => setSelectedSpot(spot)}
          >
            <View style={styles.mapPin}>
              <Text style={styles.mapPinText}>🍵</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {selectedSpot && (
        <View style={styles.mapCard}>
          <TouchableOpacity style={styles.mapClose} onPress={() => setSelectedSpot(null)}>
            <Text>✕</Text>
          </TouchableOpacity>
          
          <Text style={styles.mapCardTitle}>{selectedSpot.name}</Text>
          <Text style={styles.mapCardAddress}>{selectedSpot.address}</Text>
          
          <View style={styles.mapCardStats}>
            <Text style={styles.mapCardStat}>👥 {selectedSpot.activeNow} active</Text>
            <Text style={styles.mapCardStat}>📊 {selectedSpot.todayLogs} today</Text>
          </View>

          <TouchableOpacity style={styles.mapButton} onPress={() => handleGetDirections(selectedSpot)}>
            <Text style={styles.mapButtonText}>Get Directions</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ----------------
// Profile Screen
// ----------------
function ProfileScreen() {
  const [favorites] = useState([
    { id: 1, name: 'Iced Matcha Latte', cafe: 'Twins Cafe' },
    { id: 2, name: 'Hot Ceremonial Matcha', cafe: 'The Spoke' },
  ]);

  useEffect(() => {
    async function checkTopPerformer() {
      try {
        const profile = await getUserProfile(CURRENT_USER.username);
        console.log('[MongoDB] User profile fetched:', profile);

        const nft = await mintTopPerformerNFT(profile.username);
        console.log('[Solana NFT]', nft);
      } catch (err) {
        console.log('Profile/Solana fetch failed', err);
      }
    }

    checkTopPerformer();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>{CURRENT_USER.avatar}</Text>
        </View>
        <Text style={styles.profileUsername}>@{CURRENT_USER.username}</Text>
        <Text style={styles.profileEmail}>{CURRENT_USER.email}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{CURRENT_USER.totalPoints}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{CURRENT_USER.matchaCount}</Text>
          <Text style={styles.statLabel}>Sips</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{CURRENT_USER.streak}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{CURRENT_USER.level}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favorite Matchas</Text>
        {favorites.map(fav => (
          <View key={fav.id} style={styles.favoriteItem}>
            <Text style={styles.favoriteIcon}>🍵</Text>
            <View style={styles.favoriteInfo}>
              <Text style={styles.favoriteName}>{fav.name}</Text>
              <Text style={styles.favoriteCafe}>{fav.cafe}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Edit Profile</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Notifications</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Privacy</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={[styles.settingText, { color: '#ef4444' }]}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

// ----------------
// Main App
// ----------------
function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let icon;
          if (route.name === 'Feed') icon = '🏠';
          else if (route.name === 'Map') icon = '🗺️';
          else if (route.name === 'Profile') icon = '👤';
          return <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>{icon}</Text>;
        },
        tabBarActiveTintColor: '#6B8E23',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          height: 70,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ----------------
// Root App
// ----------------
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <View style={styles.authContainer}>
        <View style={styles.authBox}>
          <Text style={styles.authLogo}>🍵</Text>
          <Text style={styles.authTitle}>Zip & Sip</Text>
          <Text style={styles.authSubtitle}>Matcha moments, measured</Text>

          <TouchableOpacity 
            style={styles.authButton} 
            onPress={() => setIsLoggedIn(true)}
          >
            <Text style={styles.authButtonText}>Enter as @matchaenthusiast</Text>
          </TouchableOpacity>
          
          <Text style={styles.authNote}>Demo Mode • Skip Login</Text>
        </View>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <MainApp />
    </NavigationContainer>
  );
}