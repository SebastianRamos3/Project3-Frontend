import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Pressable, 
  Alert, 
  Platform 
} from 'react-native';

// Replace this with your actual backend API call if you have one
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export default function LogGameScreen({ route, navigation }) {
  const course = route.params?.course || {}; // <--- course object passed from Search screen

  // Basic form state
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
  const [holes, setHoles] = useState(String(course.numHoles || 18));
  const [score, setScore] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    try {
      const payload = {
        courseId: course.id,
        date,
        holes: Number(holes),
        score: score ? Number(score) : undefined,
        notes: notes || undefined,
      };

      const res = await fetch(`${API_BASE_URL}/api/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      Alert.alert('Success', 'Your round has been logged!');
      navigation.goBack();
    } catch (err) {
      console.error('Error saving game:', err);
      Alert.alert('Error', err.message || 'Failed to log the round.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log a Round</Text>
      <Text style={styles.subtitle}>{course.name}</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Holes Played</Text>
        <TextInput
          style={styles.input}
          value={holes}
          onChangeText={setHoles}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Score (optional)</Text>
        <TextInput
          style={styles.input}
          value={score}
          onChangeText={setScore}
          keyboardType="numeric"
          placeholder="e.g. 85"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          multiline
          placeholder="How was your round?"
        />
      </View>

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Round</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 15,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
