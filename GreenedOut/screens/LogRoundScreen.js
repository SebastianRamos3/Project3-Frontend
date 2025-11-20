import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { createRound, getCourseById } from '../api';

export default function LogRoundScreen({ navigation, route, user }) {
  const { courseId } = route.params;
  const [course, setCourse] = useState(null);
  const [holeScores, setHoleScores] = useState(
    Array.from({ length: 18 }, (_, i) => ({
      holeNumber: i + 1,
      strokes: '',
      par: 4,
    }))
  );
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(true);

  useEffect(() => {
    loadCourse();
  }, []);

  const loadCourse = async () => {
    try {
      const courseData = await getCourseById(courseId);
      setCourse(courseData);
    } catch (error) {
      console.error('Error loading course:', error);
      Alert.alert('Error', 'Failed to load course');
    } finally {
      setLoadingCourse(false);
    }
  };

  const updateHoleScore = (index, field, value) => {
    const updated = [...holeScores];
    
    if (field === 'strokes' || field === 'par') {
      updated[index][field] = value === '' ? '' : parseInt(value) || '';
    } else {
      updated[index][field] = value;
    }
    
    setHoleScores(updated);
  };

  const handleSubmit = async () => {
    const hasScores = holeScores.some(h => h.strokes > 0);
    if (!hasScores) {
      Alert.alert('Error', 'Please enter at least one hole score');
      return;
    }

    setLoading(true);
    try {
      const roundData = {
        courseId: courseId,
        datePlayed: new Date().toISOString().split('T')[0],
        holeScores: holeScores.filter(h => h.strokes > 0),
        notes: notes,
      };

      await createRound(user.id, roundData);
      Alert.alert('Success', 'Round logged successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Journal') }
      ]);
    } catch (error) {
      console.error('Error creating round:', error);
      Alert.alert('Error', 'Failed to log round');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCourse) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Course Header */}
      <View style={styles.courseHeader}>
        <Text style={styles.courseName}>{course?.name}</Text>
      </View>

      {/* Scorecard */}
      <View style={styles.scorecardSection}>
        <Text style={styles.sectionTitle}>Scorecard</Text>
        <Text style={styles.subtitle}>Enter your strokes (optional - fill in as many as you want)</Text>
        
        {holeScores.map((hole, index) => (
          <View key={index} style={styles.holeRow}>
            <Text style={styles.holeNumber}>Hole {hole.holeNumber}</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Par</Text>
              <TextInput
                style={styles.smallInput}
                keyboardType="number-pad"
                value={hole.par.toString()}
                onChangeText={(value) => updateHoleScore(index, 'par', value)}
                maxLength={1}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Strokes</Text>
              <TextInput
                style={[styles.smallInput, styles.strokesInput]}
                placeholder="0"
                keyboardType="number-pad"
                value={hole.strokes.toString() === '0' ? '' : hole.strokes.toString()}
                onChangeText={(value) => updateHoleScore(index, 'strokes', value)}
                maxLength={2}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Notes */}
      <View style={styles.notesSection}>
        <Text style={styles.sectionTitle}>Notes (Optional)</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="How was your round? Any highlights?"
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Save Round</Text>
        )}
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
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
  courseHeader: {
    backgroundColor: '#4CAF50',
    padding: 20,
    alignItems: 'center',
  },
  courseName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  scorecardSection: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
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
    fontWeight: '500',
    color: '#333',
  },
  inputGroup: {
    alignItems: 'center',
    marginLeft: 10,
  },
  inputLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  smallInput: {
    width: 50,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  strokesInput: {
    borderColor: '#4CAF50',
    backgroundColor: '#fff',
    fontWeight: '600',
  },
  notesSection: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 10,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});