import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getUserRounds, deleteRound } from '../api';

export default function JournalScreen({ navigation, user }) {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      loadRounds();
    }
  }, [user]);

  const loadRounds = async () => {
    try {
      setLoading(true);
      const roundsData = await getUserRounds(user.id);
      setRounds(roundsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load rounds');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRound = (roundId) => {
    Alert.alert(
      'Delete Round',
      'Are you sure you want to delete this round?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRound(roundId);
              setRounds(rounds.filter(r => r.id !== roundId));
              Alert.alert('Success', 'Round deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete round');
            }
          },
        },
      ]
    );
  };

  const renderRound = ({ item }) => (
    <TouchableOpacity
      style={styles.roundCard}
      onPress={() => navigation.navigate('RoundDetail', { roundId: item.id })}
    >
      <View style={styles.roundHeader}>
        <Text style={styles.courseName}>{item.courseName || 'Unknown Course'}</Text>
        <Text style={styles.score}>{item.totalStrokes}</Text>
      </View>
      <Text style={styles.date}>{item.datePlayed}</Text>
      {item.notes && <Text style={styles.notes} numberOfLines={2}>{item.notes}</Text>}
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteRound(item.id)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Golf Journal</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.addButtonText}>+ Log Round</Text>
        </TouchableOpacity>
      </View>

      {rounds.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No rounds logged yet!</Text>
          <Text style={styles.emptySubtext}>Search for a course to log your first round</Text>
        </View>
      ) : (
        <FlatList
          data={rounds}
          renderItem={renderRound}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={loadRounds}
        />
      )}
    </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    padding: 15,
  },
  roundCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  courseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  notes: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  deleteButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  deleteText: {
    color: '#f44336',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});