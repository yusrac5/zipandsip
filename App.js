import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const Tab = createBottomTabNavigator();

// Mock matcha spots - you'll replace this with real data later
const MOCK_SPOTS = [
  { id: 1, name: "Cha Cha Matcha", lat: 40.7589, lng: -73.9851, points: 15 },
  { id: 2, name: "Matchaful", lat: 40.7614, lng: -73.9776, points: 20 },
  { id: 3, name: "Té Company", lat: 40.7489, lng: -73.9680, points: 10 },
];

function HomeScreen() {
  const [points, setPoints] = useState(420);
  const [level, setLevel] = useState(7);
  const [matchaCount, setMatchaCount] = useState(23);

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroEmoji}>🍵</Text>
        <Text style={styles.heroTitle}>Matcha Quest</Text>
        <Text style={styles.heroSubtitle}>Quarter zips. Matcha. Vibes.</Text>
        <View style={styles.heroTagline}>
          <Text style={styles.taglineText}>
            Finding comfort in quiet luxury, one sip at a time
          </Text>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome back, Matcha Master</Text>
        <Text style={styles.headerSubtitle}>Your zen journey continues</Text>
      </View>

      {/* Character Display */}
      <View style={styles.characterCard}>
        <View style={styles.characterCircle}>
          <Text style={styles.characterEmoji}>🍵</Text>
        </View>
        <Text style={styles.characterName}>Matcha Master Mochi</Text>
        <Text style={styles.characterLevel}>Level {level}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{points}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{matchaCount}</Text>
          <Text style={styles.statLabel}>Matchas</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>

      {/* Monthly Challenge */}
      <View style={styles.challengeCard}>
        <Text style={styles.challengeTitle}>🎯 December Challenge</Text>
        <Text style={styles.challengeDesc}>Try a strawberry matcha this month</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '65%' }]} />
          </View>
          <Text style={styles.progressText}>65% complete</Text>
        </View>
        <Text style={styles.rewardText}>🧥 Unlock: Premium Quarter Zip</Text>
      </View>

      {/* Recent Activity */}
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Recent Sips</Text>
        <View style={styles.activityItem}>
          <Text style={styles.activityEmoji}>🍓</Text>
          <View style={styles.activityText}>
            <Text style={styles.activityName}>Strawberry Matcha</Text>
            <Text style={styles.activityLocation}>Cha Cha Matcha · 2h ago</Text>
          </View>
          <Text style={styles.activityPoints}>+15</Text>
        </View>
        <View style={styles.activityItem}>
          <Text style={styles.activityEmoji}>🍵</Text>
          <View style={styles.activityText}>
            <Text style={styles.activityName}>Classic Matcha Latte</Text>
            <Text style={styles.activityLocation}>Matchaful · Yesterday</Text>
          </View>
          <Text style={styles.activityPoints}>+20</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function MapScreen() {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 40.7589,
    longitude: -73.9851,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  return (
    <View style={styles.mapContainer}>
      <MapView style={styles.map} region={region}>
        {MOCK_SPOTS.map(spot => (
          <Marker
            key={spot.id}
            coordinate={{ latitude: spot.lat, longitude: spot.lng }}
            title={spot.name}
            description={`+${spot.points} points`}
          />
        ))}
      </MapView>
      <View style={styles.mapOverlay}>
        <Text style={styles.mapTitle}>🍵 {MOCK_SPOTS.length} spots nearby</Text>
      </View>
    </View>
  );
}

function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileCircle}>
          <Text style={styles.profileEmoji}>👤</Text>
        </View>
        <Text style={styles.profileName}>Matcha Enthusiast</Text>
        <Text style={styles.profileBio}>Quarter zip collector · Matcha maximalist</Text>
      </View>

      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Unlocked Gear</Text>
        <View style={styles.gearGrid}>
          <View style={styles.gearItem}>
            <Text style={styles.gearEmoji}>🧥</Text>
            <Text style={styles.gearName}>Basic Quarter Zip</Text>
          </View>
          <View style={styles.gearItem}>
            <Text style={styles.gearEmoji}>🧥</Text>
            <Text style={styles.gearName}>Matcha Green QZ</Text>
          </View>
          <View style={[styles.gearItem, styles.gearLocked]}>
            <Text style={styles.gearEmoji}>🔒</Text>
            <Text style={styles.gearName}>Premium QZ</Text>
          </View>
        </View>
      </View>

      <View style={styles.leaderboardSection}>
        <Text style={styles.sectionTitle}>Leaderboard</Text>
        <View style={styles.leaderboardItem}>
          <Text style={styles.rank}>1</Text>
          <Text style={styles.leaderName}>@matchaking</Text>
          <Text style={styles.leaderPoints}>1,247 pts</Text>
        </View>
        <View style={styles.leaderboardItem}>
          <Text style={styles.rank}>2</Text>
          <Text style={styles.leaderName}>You</Text>
          <Text style={styles.leaderPoints}>420 pts</Text>
        </View>
        <View style={styles.leaderboardItem}>
          <Text style={styles.rank}>3</Text>
          <Text style={styles.leaderName}>@greentealover</Text>
          <Text style={styles.leaderPoints}>389 pts</Text>
        </View>
      </View>
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#6B8E23',
          tabBarInactiveTintColor: '#999',
          headerShown: false,
          tabBarStyle: { paddingBottom: 5, paddingTop: 5, height: 60 },
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ tabBarLabel: '🏠 Home' }}
        />
        <Tab.Screen 
          name="Map" 
          component={MapScreen}
          options={{ tabBarLabel: '🗺️ Explore' }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ tabBarLabel: '👤 Profile' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9F5',
  },
  heroSection: {
    backgroundColor: '#fff',
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  heroEmoji: {
    fontSize: 80,
    marginBottom: 15,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#6B8E23',
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  heroTagline: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: '#F0F8E8',
    borderRadius: 20,
  },
  taglineText: {
    fontSize: 14,
    color: '#5A7A1F',
    textAlign: 'center',
    lineHeight: 20,
  },
  header: {
    padding: 20,
    paddingTop: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  characterCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  characterCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterEmoji: {
    fontSize: 50,
  },
  characterName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#333',
  },
  characterLevel: {
    fontSize: 14,
    color: '#6B8E23',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B8E23',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  challengeCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  challengeDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  progressContainer: {
    marginTop: 15,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6B8E23',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  rewardText: {
    fontSize: 14,
    color: '#6B8E23',
    fontWeight: 'bold',
    marginTop: 10,
  },
  activitySection: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityEmoji: {
    fontSize: 30,
    marginRight: 15,
  },
  activityText: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activityLocation: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  activityPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B8E23',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#6B8E23',
  },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileEmoji: {
    fontSize: 40,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  profileBio: {
    fontSize: 14,
    color: '#E8F5E9',
    marginTop: 5,
  },
  achievementsSection: {
    margin: 20,
  },
  gearGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gearItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  gearLocked: {
    opacity: 0.5,
  },
  gearEmoji: {
    fontSize: 30,
  },
  gearName: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 5,
    color: '#333',
  },
  leaderboardSection: {
    margin: 20,
  },
  leaderboardItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B8E23',
    marginRight: 15,
    width: 30,
  },
  leaderName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  leaderPoints: {
    fontSize: 14,
    color: '#666',
  },
});