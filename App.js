// Complete App.js with Login, Leaderboard & Financial Insights
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Platform, Linking, Dimensions, Alert, TextInput, KeyboardAvoidingView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Constants from 'expo-constants';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

const getBackendUrl = () => {
  const manifest = Constants.expoConfig || Constants.manifest;
  if (manifest?.hostUri) {
    const host = manifest.hostUri.split(':').shift();
    return `http://${host}:5000`;
  }
  return 'http://localhost:5000';
};

const BACKEND_URL = getBackendUrl();

// HARDCODED USERS FOR LOGIN
const USERS = [
  { username: 'yusrac', email: 'yusra.choudhary5@gmail.com', password: 'zipandsip', avatar: '🍵' },
  { username: 'umaizaali', email: 'umaizaali@gmail.com', password: 'zipandsip', avatar: '💚' },
];

const MATCHA_SPOTS = [
  { id: 1, name: "Twins Cafe", lat: 42.9849, lng: -81.2497, address: "1135 Richmond St", activeNow: 3, todayLogs: 8, basePoints: 15, avgPrice: 6.50 },
  { id: 2, name: "The Spoke", lat: 42.9853, lng: -81.2453, address: "1151 Richmond St", activeNow: 5, todayLogs: 12, basePoints: 20, avgPrice: 7.25 },
  { id: 3, name: "JavaTime", lat: 42.9832, lng: -81.2497, address: "171 Queens Ave", activeNow: 2, todayLogs: 6, basePoints: 10, avgPrice: 5.75 },
];

const DRINK_TYPES = [
  { id: 1, name: "Iced Matcha Latte", emoji: "🍵", avgPrice: 6.50 },
  { id: 2, name: "Hot Ceremonial", emoji: "🍵", avgPrice: 7.00 },
  { id: 3, name: "Matcha Frappe", emoji: "🍵", avgPrice: 7.50 },
  { id: 4, name: "Oat Milk Matcha", emoji: "🍵", avgPrice: 6.75 },
];

const MATCHA_IMAGES = [
  'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400',
  'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400',
  'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=400',
];

const CURRENT_USER = {
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

// HARDCODED LEADERBOARDS
const FRIENDS_LEADERBOARD = [
  { rank: 1, username: 'yusrac', points: 645, matchaCount: 43, streak: 12, avatar: '🍵' },
  { rank: 2, username: 'umaizaali', points: 520, matchaCount: 38, streak: 8, avatar: '🍵' },
  { rank: 3, username: 'aliya', points: 410, matchaCount: 31, streak: 15, avatar: '🍵' },
  { rank: 4, username: 'greenteaqueen', points: 385, matchaCount: 29, streak: 6, avatar: '🍵' },
  { rank: 5, username: 'matchaenthusiast', points: 340, matchaCount: 26, streak: 9, avatar: '🍵' },
];

const GLOBAL_LEADERBOARD = [
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

// FEED SCREEN
function FeedScreen() {
  const [moments, setMoments] = useState([]);

  useEffect(() => {
    fetchMoments();
  }, []);

  const fetchMoments = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/matcha`);
      const data = await res.json();
      setMoments(data);
    } catch {
      setMoments([
        { _id: '1', username: 'greenteaqueen', drink: 'Iced Matcha', cafe: 'Twins Cafe', points: 15, timestamp: new Date().toISOString(), image: MATCHA_IMAGES[0] },
        { _id: '2', username: 'matchaenthusiast', drink: 'Hot Ceremonial', cafe: 'The Spoke', points: 20, timestamp: new Date(Date.now() - 2*60*60*1000).toISOString(), image: MATCHA_IMAGES[1] },
      ]);
    }
  };

  const getTimeAgo = (timestamp) => {
    const hours = Math.floor((new Date() - new Date(timestamp)) / 3600000);
    return hours < 1 ? 'just now' : hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matcha Moments</Text>
        <Text style={styles.headerSubtitle}>{moments.length} recent sips</Text>
      </View>
      <ScrollView>
        {moments.map(m => (
          <View key={m._id} style={styles.post}>
            <View style={styles.postHeader}>
              <View style={styles.postUser}>
                <View style={styles.avatar}><Text style={styles.avatarText}>🍵</Text></View>
                <View>
                  <Text style={styles.username}>@{m.username || m.user}</Text>
                  <Text style={styles.cafe}>{m.cafe}</Text>
                </View>
              </View>
              <Text style={styles.time}>{getTimeAgo(m.timestamp)}</Text>
            </View>
            <Image source={{ uri: m.image || MATCHA_IMAGES[0] }} style={styles.image} />
            <View style={styles.postFooter}>
              <Text style={styles.drink}>{m.drink}</Text>
              <View style={styles.pointsBadge}><Text style={styles.pointsText}>+{m.points} pts</Text></View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// LOG SCREEN
const LogScreen = () => {
  const [cafe, setCafe] = useState(null);
  const [drink, setDrink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLog = async () => {
    if (!cafe || !drink) return Alert.alert('Oops!', 'Select cafe and drink');
    setLoading(true);
    try {
      await fetch(`${BACKEND_URL}/api/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drink: drink.name,
          cafe: cafe.name,
          points: cafe.basePoints,
          user: CURRENT_USER.username,
          location: 'London, ON',
        }),
      });
      setSuccess(true);
      CURRENT_USER.totalPoints += cafe.basePoints;
      CURRENT_USER.matchaCount += 1;
      setTimeout(() => { setSuccess(false); setCafe(null); setDrink(null); }, 2500);
    } catch { Alert.alert('Error', 'Failed to log'); }
    finally { setLoading(false); }
  };

  if (success) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F8F0' }]}>
        <Text style={{ fontSize: 80 }}>🍵</Text>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginTop: 20 }}>Moment Logged!</Text>
        <Text style={{ fontSize: 56, fontWeight: 'bold', color: '#6B8E23', marginTop: 15 }}>+{cafe?.basePoints}</Text>
        <Text style={{ fontSize: 14, color: '#666', marginTop: 10 }}>Your streak continues 🔥</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Log Your Sip 🍵</Text>
        <Text style={styles.headerSubtitle}>Track your matcha moment</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 Where are you?</Text>
        {MATCHA_SPOTS.map(c => (
          <TouchableOpacity key={c.id} style={[styles.option, cafe?.id === c.id && styles.optionSelected]} onPress={() => setCafe(c)}>
            <View>
              <Text style={styles.optionName}>{c.name}</Text>
              <Text style={styles.optionDetail}>Avg ${c.avgPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.pointsBadgeSmall}><Text style={styles.pointsTextSmall}>+{c.basePoints} pts</Text></View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🍵 What did you order?</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {DRINK_TYPES.map(d => (
            <TouchableOpacity key={d.id} style={[styles.drinkOption, drink?.id === d.id && styles.optionSelected]} onPress={() => setDrink(d)}>
              <Text style={{ fontSize: 32 }}>{d.emoji}</Text>
              <Text style={{ fontSize: 11, marginTop: 6, textAlign: 'center', fontWeight: '600' }}>{d.name}</Text>
              <Text style={{ fontSize: 10, color: '#666', marginTop: 2 }}>${d.avgPrice.toFixed(2)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {cafe && drink && (
        <View style={styles.previewCard}>
          <Text style={styles.previewLabel}>Ready to log:</Text>
          <Text style={styles.previewText}>{drink.name} at {cafe.name}</Text>
          <Text style={styles.previewPoints}>+{cafe.basePoints} points • ~${drink.avgPrice.toFixed(2)}</Text>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.button, (!cafe || !drink) && styles.buttonDisabled]} 
        onPress={handleLog} 
        disabled={!cafe || !drink || loading}
      >
        <Text style={styles.buttonText}>{loading ? '🍵 Logging...' : '✨ Log Matcha Moment'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// LEADERBOARD SCREEN
const LeaderboardScreen = () => {
  const [activeTab, setActiveTab] = useState('friends'); // 'friends' or 'global'

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const leaderboard = activeTab === 'friends' ? FRIENDS_LEADERBOARD : GLOBAL_LEADERBOARD;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Text style={styles.headerSubtitle}>Top matcha sippers</Text>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'friends' && styles.tabActive]} 
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.tabTextActive]}>👥 Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'global' && styles.tabActive]} 
          onPress={() => setActiveTab('global')}
        >
          <Text style={[styles.tabText, activeTab === 'global' && styles.tabTextActive]}>🌍 Global</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.section}>
          {leaderboard.map((user) => (
            <View 
              key={user.username} 
              style={[
                styles.leaderboardCard,
                user.isYou && styles.leaderboardCardHighlight
              ]}
            >
              <View style={styles.leaderboardRank}>
                <Text style={styles.leaderboardRankText}>{getRankBadge(user.rank)}</Text>
              </View>
              
              <View style={styles.leaderboardAvatar}>
                <Text style={styles.leaderboardAvatarText}>{user.avatar}</Text>
              </View>
              
              <View style={styles.leaderboardInfo}>
                <Text style={styles.leaderboardUsername}>
                  @{user.username} {user.isYou && <Text style={styles.youBadge}>(You)</Text>}
                </Text>
                <Text style={styles.leaderboardStats}>
                  {user.matchaCount} sips • {user.streak} day streak 🔥
                </Text>
              </View>
              
              <View style={styles.leaderboardPoints}>
                <Text style={styles.leaderboardPointsNumber}>{user.points}</Text>
                <Text style={styles.leaderboardPointsLabel}>pts</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// MAP SCREEN
const MapScreen = () => {
  const [selected, setSelected] = useState(null);
  
  return (
    <View style={styles.container}>
      <MapView style={{ flex: 1 }} initialRegion={{ latitude: 42.9849, longitude: -81.2497, latitudeDelta: 0.02, longitudeDelta: 0.02 }}>
        {MATCHA_SPOTS.map(s => (
          <Marker key={s.id} coordinate={{ latitude: s.lat, longitude: s.lng }} onPress={() => setSelected(s)}>
            <View style={styles.pin}><Text style={{ fontSize: 20 }}>🍵</Text></View>
          </Marker>
        ))}
      </MapView>
      {selected && (
        <View style={styles.mapCard}>
          <TouchableOpacity style={styles.close} onPress={() => setSelected(null)}><Text>✕</Text></TouchableOpacity>
          <Text style={styles.mapCardTitle}>{selected.name}</Text>
          <Text style={styles.mapCardAddress}>{selected.address}</Text>
          <View style={styles.mapCardStats}>
            <Text style={styles.mapCardStat}>👥 {selected.activeNow} active now</Text>
            <Text style={styles.mapCardStat}>📊 {selected.todayLogs} logged today</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(`geo:${selected.lat},${selected.lng}`)}>
            <Text style={styles.buttonText}>Get Directions</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// PROFILE SCREEN WITH FINANCIAL INSIGHTS
const ProfileScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>{CURRENT_USER.avatar}</Text>
        </View>
        <Text style={styles.profileUsername}>@{CURRENT_USER.username}</Text>
        <Text style={styles.profileEmail}>{CURRENT_USER.email}</Text>
      </View>
      
      {/* Stats Row */}
      <View style={styles.statsContainer}>
        {[
          { label: 'Points', value: CURRENT_USER.totalPoints },
          { label: 'Sips', value: CURRENT_USER.matchaCount },
          { label: 'Streak', value: `${CURRENT_USER.streak}🔥` },
          { label: 'Level', value: CURRENT_USER.level },
        ].map(s => (
          <View key={s.label} style={styles.statBox}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* FINANCIAL INSIGHTS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💰 Matcha Spending Insights</Text>
        
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Text style={styles.insightIcon}>📊</Text>
            <Text style={styles.insightTitle}>This Month</Text>
          </View>
          <Text style={styles.insightAmount}>${CURRENT_USER.monthlySpend.toFixed(2)}</Text>
          <Text style={styles.insightDetail}>on {CURRENT_USER.matchaCount} matcha purchases</Text>
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Text style={styles.insightIcon}>💸</Text>
            <Text style={styles.insightTitle}>Average Price Per Matcha</Text>
          </View>
          <Text style={styles.insightAmount}>${CURRENT_USER.avgPricePerMatcha.toFixed(2)}</Text>
          <Text style={styles.insightDetail}>across all your purchases</Text>
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Text style={styles.insightIcon}>📈</Text>
            <Text style={styles.insightTitle}>Projected Yearly Spend</Text>
          </View>
          <Text style={styles.insightAmount}>${CURRENT_USER.projectedYearlySpend.toFixed(0)}</Text>
          <Text style={styles.insightDetail}>if you continue at current pace</Text>
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Text style={styles.insightIcon}>💡</Text>
            <Text style={styles.insightTitle}>Money-Saving Tip</Text>
          </View>
          <Text style={styles.insightTip}>
            Switching from {CURRENT_USER.mostExpensiveSpot} to {CURRENT_USER.cheapestSpot} 
            could save you ~$75/month 💚
          </Text>
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Text style={styles.insightIcon}>🏆</Text>
            <Text style={styles.insightTitle}>Best Value Spots</Text>
          </View>
          {MATCHA_SPOTS.sort((a, b) => a.avgPrice - b.avgPrice).map((spot, idx) => (
            <View key={spot.id} style={styles.valueSpotRow}>
              <Text style={styles.valueSpotRank}>{idx + 1}.</Text>
              <Text style={styles.valueSpotName}>{spot.name}</Text>
              <Text style={styles.valueSpotPrice}>${spot.avgPrice.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Settings */}
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

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

// MAIN APP
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // LOGIN SCREEN COMPONENT
  const LoginScreen = ({ onLogin }) => {
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleLogin = () => {
      const user = USERS.find(u => u.email === email && u.password === password);
      if (user) {
        CURRENT_USER.username = user.username;
        CURRENT_USER.email = user.email;
        CURRENT_USER.avatar = user.avatar;
        onLogin(true);
      } else {
        Alert.alert('Login Failed', 'Invalid email or password');
      }
    };

    const handleSignup = () => {
      if (!email || !password || !username) {
        Alert.alert('Error', 'Please fill all fields');
        return;
      }
      CURRENT_USER.username = username;
      CURRENT_USER.email = email;
      CURRENT_USER.avatar = '🍵';
      onLogin(true);
    };

    const quickLogin = (userEmail, userPass) => {
      setEmail(userEmail);
      setPassword(userPass);
      setTimeout(() => {
        const user = USERS.find(u => u.email === userEmail && u.password === userPass);
        if (user) {
          CURRENT_USER.username = user.username;
          CURRENT_USER.email = user.email;
          CURRENT_USER.avatar = user.avatar;
          onLogin(true);
        }
      }, 100);
    };

    return (
      <KeyboardAvoidingView style={styles.authContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.authScrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.authBox}>
            <Text style={styles.authLogo}>🍵</Text>
            <Text style={styles.authTitle}>Zip & Sip</Text>
            <Text style={styles.authSubtitle}>Matcha moments, measured</Text>

            {isSignup && (
              <TextInput
                style={styles.authInput}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            )}

            <TextInput
              style={styles.authInput}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />

            <TextInput
              style={styles.authInput}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />

            <TouchableOpacity 
              style={styles.authButton} 
              onPress={isSignup ? handleSignup : handleLogin}
            >
              <Text style={styles.authButtonText}>
                {isSignup ? 'Sign Up' : 'Login'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsSignup(!isSignup)} style={{ marginTop: 15 }}>
              <Text style={styles.authSwitch}>
                {isSignup 
                  ? "Already have an account? Login" 
                  : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>

            <View style={styles.demoSection}>
              <Text style={styles.demoTitle}>Tap to Login</Text>
              
              <TouchableOpacity 
                style={styles.demoAccount}
                onPress={() => quickLogin('yusra.choudhary5@gmail.com', 'zipandsip')}
              >
                <Text style={styles.demoEmoji}>🍵</Text>
                <View style={styles.demoInfo}>
                  <Text style={styles.demoUsername}>@yusrac</Text>
                  <Text style={styles.demoEmail}>yusra.choudhary5@gmail.com</Text>
                </View>
                <Text style={styles.demoArrow}>→</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.demoAccount}
                onPress={() => quickLogin('umaizaali@gmail.com', 'zipandsip')}
              >
                <Text style={styles.demoEmoji}>💚</Text>
                <View style={styles.demoInfo}>
                  <Text style={styles.demoUsername}>@umaizaali</Text>
                  <Text style={styles.demoEmail}>umaizaali@gmail.com</Text>
                </View>
                <Text style={styles.demoArrow}>→</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.authFooter}>
              Both accounts use password: zipandsip
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={setIsLoggedIn} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const icons = { Feed: '🏠', Log: '➕', Leaderboard: '🏆', Map: '🗺️', Profile: '👤' };
          return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icons[route.name]}</Text>;
        },
        tabBarActiveTintColor: '#6B8E23',
        headerShown: false,
        tabBarStyle: { height: 70, paddingBottom: 10, paddingTop: 5 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      })}>
        <Tab.Screen name="Feed" component={FeedScreen} />
        <Tab.Screen name="Log" component={LogScreen} />
        <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#1a1a1a' },
  headerSubtitle: { fontSize: 13, color: '#999', marginTop: 4 },
  
  // Feed
  post: { marginBottom: 2, backgroundColor: '#fff' },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 15 },
  postUser: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F8F0', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { fontSize: 20 },
  username: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  cafe: { fontSize: 12, color: '#999', marginTop: 2 },
  time: { fontSize: 12, color: '#999' },
  image: { width, height: width, backgroundColor: '#f0f0f0' },
  postFooter: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center' },
  drink: { fontSize: 15, fontWeight: '600' },
  pointsBadge: { backgroundColor: '#F0F8F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  pointsText: { fontSize: 13, fontWeight: '700', color: '#6B8E23' },
  pointsBadgeSmall: { backgroundColor: '#F0F8F0', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  pointsTextSmall: { fontSize: 11, fontWeight: '700', color: '#6B8E23' },
  
  // Log Screen
  section: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 15, color: '#1a1a1a' },
  option: { padding: 16, borderRadius: 12, borderWidth: 2, borderColor: '#f0f0f0', marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  optionSelected: { borderColor: '#6B8E23', backgroundColor: '#F0F8F0' },
  optionName: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  optionDetail: { fontSize: 12, color: '#666', marginTop: 3 },
  drinkOption: { width: (width - 60) / 2, padding: 15, borderRadius: 12, borderWidth: 2, borderColor: '#f0f0f0', alignItems: 'center' },
  previewCard: { marginHorizontal: 20, marginBottom: 15, padding: 16, borderRadius: 12, backgroundColor: '#F0F8F0', borderWidth: 2, borderColor: '#6B8E23' },
  previewLabel: { fontSize: 11, fontWeight: '700', color: '#6B8E23', marginBottom: 4 },
  previewText: { fontSize: 15, fontWeight: '600', color: '#1a1a1a', marginBottom: 6 },
  previewPoints: { fontSize: 12, color: '#666' },
  button: { marginHorizontal: 20, marginBottom: 20, height: 52, borderRadius: 14, backgroundColor: '#6B8E23', justifyContent: 'center', alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  
  // Leaderboard
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', gap: 10 },
  tab: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#f5f5f5', alignItems: 'center' },
  tabActive: { backgroundColor: '#6B8E23' },
  tabText: { fontSize: 14, fontWeight: '700', color: '#666' },
  tabTextActive: { color: '#fff' },
  leaderboardCard: { flexDirection: 'row', alignItems: 'center', padding: 15, marginBottom: 10, borderRadius: 12, backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#f0f0f0' },
  leaderboardCardHighlight: { backgroundColor: '#F0F8F0', borderColor: '#6B8E23', borderWidth: 2 },
  leaderboardRank: { width: 45, alignItems: 'center' },
  leaderboardRankText: { fontSize: 18, fontWeight: '800' },
  leaderboardAvatar: { width: 45, height: 45, borderRadius: 22, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  leaderboardAvatarText: { fontSize: 24 },
  leaderboardInfo: { flex: 1 },
  leaderboardUsername: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  youBadge: { fontSize: 12, color: '#6B8E23', fontWeight: '600' },
  leaderboardStats: { fontSize: 12, color: '#666', marginTop: 3 },
  leaderboardPoints: { alignItems: 'flex-end' },
  leaderboardPointsNumber: { fontSize: 20, fontWeight: '800', color: '#6B8E23' },
  leaderboardPointsLabel: { fontSize: 11, color: '#666', marginTop: 2 },
  
  // Map
  pin: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', borderWidth: 2, borderColor: '#6B8E23', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  mapCard: { position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, elevation: 5 },
  close: { position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderRadius: 14, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  mapCardTitle: { fontSize: 20, fontWeight: '800', color: '#1a1a1a', marginBottom: 4 },
  mapCardAddress: { fontSize: 13, color: '#666', marginBottom: 15 },
  mapCardStats: { flexDirection: 'row', gap: 15, marginBottom: 15 },
  mapCardStat: { fontSize: 13, color: '#666', fontWeight: '600' },
  
  // Profile
  profileHeader: { alignItems: 'center', paddingVertical: 40, backgroundColor: '#F8F9FA' },
  profileAvatar: { width: 85, height: 85, borderRadius: 42, backgroundColor: '#6B8E23', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  profileAvatarText: { fontSize: 42 },
  profileUsername: { fontSize: 26, fontWeight: '800', color: '#1a1a1a', marginBottom: 4 },
  profileEmail: { fontSize: 14, color: '#999' },
  
  statsContainer: { flexDirection: 'row', paddingVertical: 25, paddingHorizontal: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800', color: '#6B8E23', marginBottom: 5 },
  statLabel: { fontSize: 12, color: '#666', fontWeight: '600' },
  
  // Financial Insights
  insightCard: { backgroundColor: '#f9f9f9', borderRadius: 14, padding: 18, marginBottom: 15, borderWidth: 1, borderColor: '#f0f0f0' },
  insightHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  insightIcon: { fontSize: 24, marginRight: 10 },
  insightTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  insightAmount: { fontSize: 32, fontWeight: '900', color: '#6B8E23', marginBottom: 6 },
  insightDetail: { fontSize: 13, color: '#666' },
  insightTip: { fontSize: 14, color: '#1a1a1a', lineHeight: 20, marginTop: 8 },
  
  valueSpotRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0', marginTop: 8 },
  valueSpotRank: { fontSize: 14, fontWeight: '700', color: '#999', width: 30 },
  valueSpotName: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  valueSpotPrice: { fontSize: 14, fontWeight: '700', color: '#6B8E23' },
  
  // Settings
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  settingText: { fontSize: 16, color: '#1a1a1a', fontWeight: '500' },
  settingArrow: { fontSize: 18, color: '#999' },
  
  // Login/Auth Screen
  authContainer: { flex: 1, backgroundColor: '#F0F8F0' },
  authScrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  authBox: { backgroundColor: '#fff', borderRadius: 24, padding: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  authLogo: { fontSize: 80, textAlign: 'center', marginBottom: 15 },
  authTitle: { fontSize: 32, fontWeight: '900', textAlign: 'center', color: '#1a1a1a', marginBottom: 8 },
  authSubtitle: { fontSize: 15, textAlign: 'center', color: '#666', marginBottom: 30 },
  authInput: { backgroundColor: '#f5f5f5', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e0e0e0', color: '#1a1a1a' },
  authButton: { backgroundColor: '#6B8E23', borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 10 },
  authButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  authSwitch: { textAlign: 'center', color: '#6B8E23', fontSize: 14, fontWeight: '600' },
  authFooter: { textAlign: 'center', color: '#999', fontSize: 12, marginTop: 15, fontStyle: 'italic' },
  
  demoSection: { marginTop: 30, paddingTop: 25, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  demoTitle: { fontSize: 14, fontWeight: '700', color: '#666', marginBottom: 15, textAlign: 'center' },
  demoAccount: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e0e0e0' },
  demoEmoji: { fontSize: 28, marginRight: 12 },
  demoInfo: { flex: 1 },
  demoUsername: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  demoEmail: { fontSize: 12, color: '#666', marginTop: 2 },
  demoArrow: { fontSize: 20, color: '#6B8E23' },
});