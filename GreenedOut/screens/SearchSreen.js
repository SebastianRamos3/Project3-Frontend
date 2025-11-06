import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  FlatList, 
  Text, 
  SafeAreaView 
} from 'react-native';

const DUMMY_COURSES = [
  { id: '1', name: 'Pebble Beach Golf Links' },
  { id: '2', name: 'Augusta National Golf Club' },
  { id: '3', name: 'St. Andrews (Old Course)' },
  { id: '4', name: 'Pine Valley Golf Club' },
  { id: '5', name: 'Cypress Point Club' },
  { id: '6', 'name': 'Bandon Dunes Golf Resort' },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const renderCourseItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by course name, city..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={DUMMY_COURSES}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item.id}
      />
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
  itemContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '500',
  },
});