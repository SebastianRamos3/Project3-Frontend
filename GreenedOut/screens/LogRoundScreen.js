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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { createRound, getCourseById } from '../api';

export default function LogRoundScreen({ route, navigation }) {
  const { courseId, userId } = route.params; // Get userId from navigation params
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Array of hole scores: [{ par: '', strokes: '' }, ...]
  const [holes, setHoles] = useState(
    Array(18).fill(null).map(() => ({ par: '', strokes: '' }))
  );
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadCourseData();
  }, []);

  const loadCourseData = async () => {
    try {
      const courseData = await getCourseById(courseId);
      setCourse(courseData);
    } catch (error) {
      console.error('Failed to load course:', error);
      Alert.alert('Error', 'Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const updateHole = (index, field, value) => {
    const newHoles = [...holes];
    newHoles[index] = {
      ...newHoles[index],
      [field]: value,
    };
    setHoles(newHoles);
  };

  const calculateTotal = () => {
    return holes.reduce((sum, hole) => {
      const strokes = parseInt(hole.strokes) || 0;
      return sum + strokes;
    }, 0);
  };

  const calculateTotalPar = () => {
    return holes.reduce((sum, hole) => {
      const par = parseInt(hole.par) || 0;
      return sum + par;
    }, 0);
  };

  const calculateScore = () => {
    return calculateTotal() - calculateTotalPar();
  };

  const handleSubmit = async () => {
    const total = calculateTotal();
    if (total === 0) {
      Alert.alert('Error', 'Please enter your scores');
      return;
    }

    setSubmitting(true);
    try {
      const roundData = {
        userId: userId, // Use the userId passed from navigation
        courseId: courseId,
        datePlayed: date, // Backend expects 'datePlayed' not 'date'
        notes: notes,
        holeScores: holes.map((hole, index) => ({ // Backend expects 'holeScores' not 'holes'
          holeNumber: index + 1,
          par: parseInt(hole.par) || 4,
          strokes: parseInt(hole.strokes) || 0,
        })),
      };

      console.log('Submitting round data:', roundData);
      await createRound(roundData);
      
      Alert.alert('Success', 'Round logged successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Failed to log round:', error);
      Alert.alert('Error', 'Failed to log round. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Course Details</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Log Round</Text>
        </View>

        {/* Course Info */}
        <View style={styles.courseInfo}>
          <Text style={styles.courseName}>{course?.name}</Text>
          <Text style={styles.courseLocation}>
            📍 {course?.city}, {course?.state}
          </Text>
          <Text style={styles.courseHoles}>⛳ {course?.numHoles} Holes</Text>
        </View>

        {/* Date Input */}
        <View style={styles.dateSection}>
          <Text style={styles.sectionTitle}>Date</Text>
          <TextInput
            style={styles.dateInput}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
          />
        </View>

        {/* Scorecard */}
        <View style={styles.scorecardSection}>
          <Text style={styles.sectionTitle}>Scorecard</Text>
          <Text style={styles.sectionSubtitle}>Enter par and your strokes for each hole</Text>

          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Hole</Text>
            <Text style={styles.headerCell}>Par</Text>
            <Text style={styles.headerCell}>Strokes</Text>
          </View>

          {holes.map((hole, index) => (
            <View key={index} style={styles.holeRow}>
              <Text style={styles.holeNumber}>Hole {index + 1}</Text>
              
              <TextInput
                style={styles.smallInput}
                value={hole.par}
                onChangeText={(value) => updateHole(index, 'par', value)}
                keyboardType="number-pad"
                maxLength={1}
                placeholder="-"
                placeholderTextColor="#999"
              />
              
              <TextInput
                style={[styles.smallInput, styles.strokesInput]}
                value={hole.strokes}
                onChangeText={(value) => updateHole(index, 'strokes', value)}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="0"
                placeholderTextColor="#999"
              />
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Par:</Text>
            <Text style={styles.summaryValue}>{calculateTotalPar()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Strokes:</Text>
            <Text style={styles.summaryValue}>{calculateTotal()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Score:</Text>
            <Text style={[styles.summaryValue, styles.scoreValue]}>
              {calculateScore() > 0 ? '+' : ''}{calculateScore()}
            </Text>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes about your round..."
            multiline
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? 'Saving...' : 'Save Round'}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  courseInfo: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  courseName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  courseLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  courseHoles: {
    fontSize: 16,
    color: '#666',
  },
  dateSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  scorecardSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
    marginBottom: 10,
  },
  headerCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    textAlign: 'center',
  },
  holeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  holeNumber: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  smallInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginHorizontal: 5,
  },
  strokesInput: {
    borderColor: '#4CAF50',
    backgroundColor: '#fff',
    fontWeight: '600',
  },
  summarySection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    borderTopWidth: 3,
    borderTopColor: '#4CAF50',
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreValue: {
    color: '#4CAF50',
    fontSize: 20,
  },
  notesSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    backgroundColor: '#f9f9f9',
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