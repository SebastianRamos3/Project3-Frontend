import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { getCourseById } from '../api';

export default function CourseDetailsScreen({ route, navigation }) {
  const { courseId, userId } = route.params;
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, []);

  const loadCourse = async () => {
    try {
      const data = await getCourseById(courseId);
      setCourse(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const openDirections = () => {
    const { latitude, longitude, name } = course;
    const label = encodeURIComponent(name);
    
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    });

    Linking.openURL(url);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Course not found</Text>
      </View>
    );
  }

  const region = {
    latitude: course.latitude,
    longitude: course.longitude,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.courseName} numberOfLines={2}>{course.name}</Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          <Marker
            coordinate={{
              latitude: course.latitude,
              longitude: course.longitude,
            }}
            title={course.name}
            pinColor="#4CAF50"
          />
        </MapView>
        
        <TouchableOpacity 
          style={styles.directionsButton}
          onPress={openDirections}
        >
          <Ionicons name="navigate" size={20} color="#fff" />
          <Text style={styles.directionsText}>Get Directions</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="location" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.cardTitle}>Location</Text>
          </View>
          <Text style={styles.locationText}>
            {course.city}, {course.state}
          </Text>
          <Text style={styles.locationSubtext}>
            {course.country}
          </Text>
          {course.zipCode && (
            <Text style={styles.locationSubtext}>{course.zipCode}</Text>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="golf" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.cardTitle}>Course Info</Text>
          </View>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Holes</Text>
              <Text style={styles.infoValue}>{course.numHoles}</Text>
            </View>
            
            {course.clubName && course.clubName !== course.name && (
              <View style={styles.infoItemFull}>
                <Text style={styles.infoLabel}>Club Name</Text>
                <Text style={styles.infoValue}>{course.clubName}</Text>
              </View>
            )}
          </View>
        </View>

        {course.description && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconCircle}>
                <Ionicons name="document-text" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.cardTitle}>About</Text>
            </View>
            <Text style={styles.descriptionText}>{course.description}</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.logRoundButton}
          onPress={() => navigation.navigate('LogRound', { courseId: course.id, userId: userId })}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.logRoundButtonText}>Log Round</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  courseName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  mapContainer: {
    height: 250,
    position: 'relative',
    backgroundColor: '#e0e0e0',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  directionsButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  directionsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  locationSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  infoGrid: {
    flexDirection: 'column',
  },
  infoItem: {
    marginBottom: 12,
  },
  infoItemFull: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  buttonContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  logRoundButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  logRoundButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});