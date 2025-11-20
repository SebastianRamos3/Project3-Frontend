import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getCourseById } from '../api';

export default function CourseDetailScreen({ navigation, route, user }) {
  const { courseId } = route.params;
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, []);

  const loadCourse = async () => {
    try {
      const courseData = await getCourseById(courseId);
      console.log('Course data:', courseData); // Debug log
      setCourse(courseData);
    } catch (error) {
      console.error('Error loading course:', error);
      Alert.alert('Error', 'Failed to load course details');
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

  if (!course) {
    return (
      <View style={styles.centerContainer}>
        <Text>Course not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Course Header */}
      <View style={styles.header}>
        <Text style={styles.courseName}>{course.name}</Text>
        {course.clubName && course.clubName !== course.name && (
          <Text style={styles.clubName}>{course.clubName}</Text>
        )}
      </View>

      <ScrollView style={styles.content}>
        {/* Location */}
        {(course.city || course.state || course.country) && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>📍 Location</Text>
            <Text style={styles.infoText}>
              {[course.city, course.state, course.country]
                .filter(Boolean)
                .join(', ')}
            </Text>
            {course.zipCode && (
              <Text style={styles.infoText}>{course.zipCode}</Text>
            )}
          </View>
        )}

        {/* Course Info */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>⛳ Course Info</Text>
          {course.numHoles && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Holes:</Text>
              <Text style={styles.value}>{course.numHoles}</Text>
            </View>
          )}
        </View>

        {/* Contact Info */}
        {(course.phoneNumber || course.website) && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>📞 Contact</Text>
            {course.phoneNumber && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.value}>{course.phoneNumber}</Text>
              </View>
            )}
            {course.website && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Website:</Text>
                <Text style={[styles.value, styles.link]} numberOfLines={1}>
                  {course.website}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Description */}
        {course.description && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>ℹ️ About</Text>
            <Text style={styles.description}>{course.description}</Text>
          </View>
        )}

        {/* Coordinates - for debugging, can remove */}
        {(course.latitude || course.longitude) && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>🗺️ Coordinates</Text>
            <Text style={styles.infoText}>
              {course.latitude}, {course.longitude}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Log Round Button */}
      <TouchableOpacity
        style={styles.logRoundButton}
        onPress={() => navigation.navigate('LogRound', { courseId: course.id })}
      >
        <Text style={styles.logRoundButtonText}>Log Round</Text>
      </TouchableOpacity>
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
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 10,
  },
  courseName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  clubName: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
    textAlign: 'center',
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  label: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  link: {
    color: '#4CAF50',
  },
  logRoundButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    margin: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  logRoundButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});