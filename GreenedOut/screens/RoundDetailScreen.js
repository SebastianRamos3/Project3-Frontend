import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getRoundById } from '../api';

export default function RoundDetailScreen({ route }) {
  const { roundId } = route.params;
  const [round, setRound] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRound();
  }, []);

  const loadRound = async () => {
    try {
      const roundData = await getRoundById(roundId);
      setRound(roundData);
    } catch (error) {
      console.error('Error loading round:', error);
      Alert.alert('Error', 'Failed to load round details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!round) {
    return (
      <View style={styles.centerContainer}>
        <Text>Round not found</Text>
      </View>
    );
  }

  const calculateScore = (strokes, par) => {
    const diff = strokes - par;
    if (diff === 0) return 'Par';
    if (diff === -2) return 'Eagle';
    if (diff === -1) return 'Birdie';
    if (diff === 1) return 'Bogey';
    if (diff === 2) return 'Double Bogey';
    if (diff < 0) return `${Math.abs(diff)} under`;
    return `+${diff}`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.courseName}>{round.courseName}</Text>
        <Text style={styles.date}>{round.datePlayed}</Text>
        <Text style={styles.totalScore}>{round.totalStrokes} strokes</Text>
      </View>

      {/* Notes */}
      {round.notes && (
        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notesText}>{round.notes}</Text>
        </View>
      )}

      {/* Scorecard */}
      <View style={styles.scorecardSection}>
        <Text style={styles.sectionTitle}>Scorecard</Text>
        {round.holeScores && round.holeScores.length > 0 ? (
          round.holeScores.map((hole) => (
            <View key={hole.holeNumber} style={styles.holeRow}>
              <Text style={styles.holeNumber}>Hole {hole.holeNumber}</Text>
              <Text style={styles.par}>Par {hole.par}</Text>
              <Text style={styles.strokes}>{hole.strokes} strokes</Text>
              <Text style={[
                styles.score,
                hole.strokes < hole.par && styles.underPar,
                hole.strokes > hole.par && styles.overPar,
              ]}>
                {calculateScore(hole.strokes, hole.par)}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noScores}>No hole scores recorded</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    alignItems: 'center',
  },
  courseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  totalScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  notesSection: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  notesText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  scorecardSection: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
  },
  holeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  holeNumber: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  par: {
    width: 60,
    fontSize: 14,
    color: '#666',
  },
  strokes: {
    width: 80,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  score: {
    width: 100,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    color: '#666',
  },
  underPar: {
    color: '#4CAF50',
  },
  overPar: {
    color: '#f44336',
  },
  noScores: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
});