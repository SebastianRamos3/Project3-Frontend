import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  FlatList, 
  Text, 
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable
} from 'react-native';
import { getAllCourses, searchCourses } from '../api';

export default function SearchScreen({ navigation, user }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    loadAllCourses();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.city && course.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (course.state && course.state.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, courses]);

  const loadAllCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCourses();
      setCourses(data);
      setFilteredCourses(data);
    } catch (err) {
      setError('Failed to load courses. Make sure the backend is running.');
      Alert.alert(
        'Connection Error',
        'Could not connect to the server. Is your backend running?',
        [
          { text: 'Retry', onPress: loadAllCourses },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      loadAllCourses();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchCourses(searchQuery);
      setCourses(data);
      setFilteredCourses(data);
    } catch (err) {
      setError('Failed to search courses.');
    } finally {
      setLoading(false);
    }
  };

  const handleCoursePress = (course) => {
    navigation.navigate('CourseDetail', { 
      courseId: course.id,
      userId: user.id
    });
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCourse(null);
  };

  const goToLogGame = () => {
    closeModal();
    if (selectedCourse && user) {
      navigation.navigate('LogRound', {
        courseId: selectedCourse.id,
        userId: user.id
      });
    }
  };

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => handleCoursePress(item)}
    >
      <Text style={styles.itemName}>{item.name}</Text>
      {item.clubName && item.clubName !== item.name && (
        <Text style={styles.clubName}>{item.clubName}</Text>
      )}
      {(item.city || item.state) && (
        <Text style={styles.location}>
          {item.city}{item.city && item.state ? ', ' : ''}{item.state}
        </Text>
      )}
      {item.numHoles && (
        <Text style={styles.holes}>{item.numHoles} holes</Text>
      )}
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => {
    if (loading) {
      return null;
    }
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {error 
            ? error 
            : courses.length === 0 
              ? 'No courses available. Import some courses first!' 
              : 'No courses found matching your search.'}
        </Text>
        {courses.length === 0 && !error && (
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadAllCourses}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by course name, city, state..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading courses...</Text>
        </View>
      )}

      {!loading && (
        <>
          {filteredCourses.length > 0 && (
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
              </Text>
            </View>
          )}

          <FlatList
            data={filteredCourses}
            renderItem={renderCourseItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={renderEmptyComponent}
            contentContainerStyle={
              filteredCourses.length === 0 ? styles.emptyList : null
            }
          />
        </>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackdrop}>
          <Pressable style={styles.modalBackdropPressable} onPress={closeModal} />
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle} numberOfLines={2}>
              {selectedCourse?.name || 'Course'}
            </Text>

            {selectedCourse?.clubName && selectedCourse?.clubName !== selectedCourse?.name ? (
              <Text style={styles.modalLine}>🏌️ {selectedCourse.clubName}</Text>
            ) : null}

            {(selectedCourse?.city || selectedCourse?.state) ? (
              <Text style={styles.modalLine}>
                📍 {selectedCourse?.city}{selectedCourse?.city && selectedCourse?.state ? ', ' : ''}{selectedCourse?.state}
              </Text>
            ) : null}

            {selectedCourse?.numHoles ? (
              <Text style={styles.modalLine}>⛳ {selectedCourse.numHoles} holes</Text>
            ) : null}

            {selectedCourse?.phoneNumber ? (
              <Text style={styles.modalLine}>📞 {selectedCourse.phoneNumber}</Text>
            ) : null}

            <View style={styles.modalButtons}>
              <Pressable style={[styles.modalButton, styles.modalButtonSecondary]} onPress={closeModal}>
                <Text style={styles.modalButtonSecondaryText}>Close</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={goToLogGame}>
                <Text style={styles.modalButtonText}>Log a round</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchBar: {
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  resultsHeader: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultsCount: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  itemContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  clubName: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  holes: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalBackdropPressable: { flex: 1 },
  modalCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 18,
    paddingBottom: 28,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, color: '#222' },
  modalLine: { fontSize: 14, marginTop: 6, color: '#333' },
  modalButtons: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalButtonText: { color: 'white', fontWeight: '700' },
  modalButtonSecondary: {
    backgroundColor: '#e6e6e6',
  },
  modalButtonSecondaryText: {
    color: '#333',
    fontWeight: '700',
  },
});
