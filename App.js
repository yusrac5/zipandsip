import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

// Use **ngrok HTTP URL** for fetch
// ----- BACKEND URL -----
const BACKEND_URL = 'http://10.0.0.105:5000';

const Tab = createBottomTabNavigator();

const MOCK_SPOTS = [
  { id: 1, name: "Cha Cha Matcha", lat: 40.7589, lng: -73.9851, points: 15 },
  { id: 2, name: "Matchaful", lat: 40.7614, lng: -73.9776, points: 20 },
  { id: 3, name: "Té Company", lat: 40.7489, lng: -73.9680, points: 10 },
];

function HomeScreen() {
  const [points, setPoints] = useState(0);
  const [matchaCount, setMatchaCount] = useState(0);
  const [level, setLevel] = useState(1);
  const [recentSips, setRecentSips] = useState([]);

  useEffect(() => {
    async function fetchSips() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/matcha`);
        if (!res.ok) {
          console.error('HTTP error', res.status);
          setRecentSips([]);
          return;
        }
        const data = await res.json();
        setRecentSips(data);
        const totalPoints = data.reduce((sum, sip) => sum + sip.points, 0);
        setPoints(totalPoints);
        setMatchaCount(data.length);
        setLevel(Math.floor(totalPoints / 100) + 1);
      } catch (err) {
        console.error('Error fetching sips:', err);
        setRecentSips([]);
      }
    }
    fetchSips();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroSection}>
        <Text style={styles.heroEmoji}>🍵</Text>
        <Text style={styles.heroTitle}>Zip & Sip</Text>
        <Text style={styles.heroSubtitle}>Quarter zips. Matcha. Vibes.</Text>
      </View>
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
          <Text style={styles.statNumber}>{level}</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
      </View>
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Recent Sips</Text>
        {recentSips.map(sip => (
          <View key={sip._id} style={styles.activityItem}>
            <Text style={styles.activityEmoji}>🍵</Text>
            <View style={styles.activityText}>
              <Text style={styles.activityName}>{sip.drink}</Text>
              <Text style={styles.activityLocation}>
                {sip.cafe} · {new Date(sip.timestamp).toLocaleString()}
              </Text>
            </View>
            <Text style={styles.activityPoints}>+{sip.points}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function ProfileScreen() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/leaderboard`);
        if (!res.ok) {
          console.error('Leaderboard HTTP error', res.status);
          setLeaderboard([]);
          return;
        }
        const data = await res.json();
        setLeaderboard(data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setLeaderboard([]);
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Leaderboard</Text>
      {leaderboard.map((user, idx) => (
        <View key={user._id} style={styles.leaderboardItem}>
          <Text style={styles.rank}>{idx + 1}</Text>
          <Text style={styles.leaderName}>{user.username}</Text>
          <Text style={styles.leaderPoints}>{user.points} pts</Text>
        </View>
      ))}
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
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9F5' },
  heroSection: { backgroundColor: '#fff', paddingVertical: 60, alignItems: 'center' },
  heroEmoji: { fontSize: 80, marginBottom: 15 },
  heroTitle: { fontSize: 42, fontWeight: 'bold', color: '#6B8E23' },
  heroSubtitle: { fontSize: 18, color: '#666', marginTop: 8, fontStyle: 'italic' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', margin: 20 },
  statBox: { backgroundColor: '#fff', padding: 15, borderRadius: 10, alignItems: 'center', flex: 1, marginHorizontal: 5 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#6B8E23' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 5 },
  activitySection: { margin: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  activityItem: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  activityEmoji: { fontSize: 30, marginRight: 15 },
  activityText: { flex: 1 },
  activityName: { fontSize: 16, fontWeight: '600', color: '#333' },
  activityLocation: { fontSize: 12, color: '#999', marginTop: 2 },
  activityPoints: { fontSize: 16, fontWeight: 'bold', color: '#6B8E23' },
  leaderboardItem: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  rank: { fontSize: 18, fontWeight: 'bold', color: '#6B8E23', marginRight: 15, width: 30 },
  leaderName: { flex: 1, fontSize: 16, color: '#333' },
  leaderPoints: { fontSize: 14, color: '#666' },
});
