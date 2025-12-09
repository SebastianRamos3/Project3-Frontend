<<<<<<< HEAD
const API_BASE_URL = typeof window !== 'undefined' 
  ? 'http://localhost:8080/api'
  : 'http://10.0.0.200:8080/api';
=======
const API_BASE_URL = 'http://10.0.0.238:8080/api'; // julian home
//const API_BASE_URL = 'http://10.11.126.58:8080/api'; //csumb
>>>>>>> f9df0c1d696a16f8c4bb810918ef4390b0ea1252


console.log('API Base URL:', API_BASE_URL);

async function apiFetch(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Fetching:', url);
    console.log('Request options:', JSON.stringify(options, null, 2));
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });


    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response data:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('API Fetch Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    throw error;
  }
}


export async function getAllCourses() {
  return apiFetch('/courses');
}

export async function searchCourses(searchQuery) {
  return apiFetch(`/courses/search?name=${encodeURIComponent(searchQuery)}`);
}

export async function getCourseById(id) {
  return apiFetch(`/courses/${id}`);
}

export async function getCoursesByCity(city) {
  return apiFetch(`/courses/city/${encodeURIComponent(city)}`);
}

export async function getCoursesByState(state) {
  return apiFetch(`/courses/state/${encodeURIComponent(state)}`);
}

export async function createCourse(courseData) {
  return apiFetch('/courses', {
    method: 'POST',
    body: JSON.stringify(courseData),
  });
}

export async function updateCourse(id, courseData) {
  return apiFetch(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(courseData),
  });
}

export async function deleteCourse(id) {
  return apiFetch(`/courses/${id}`, {
    method: 'DELETE',
  });
}

export async function getCoursesCount() {
  return apiFetch('/courses/count');
}

export async function importCoursesFromExternalApi(searchQuery) {
  return apiFetch(`/golf-api/import?search=${encodeURIComponent(searchQuery)}`);
}

export async function fetchExternalCourse(courseId) {
  return apiFetch(`/golf-api/fetch/${courseId}`);
}

export async function checkExternalApiHealth() {
  return apiFetch('/golf-api/health');
}

export async function signUp(userData) {
  return apiFetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function login(credentials) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

<<<<<<< HEAD
export async function loginWithGoogle(idToken) {
  return apiFetch('/auth/oauth/google', {
    method: 'POST',
    body: JSON.stringify({
      idToken: idToken,
      provider: 'google',
    }),
  });
}
=======
// ============================================
// ROUNDS/JOURNAL ENDPOINTS
// ============================================

/**
 * Create a new round (log a golf round)
 * @param {object} roundData - { userId, courseId, datePlayed, holeScores, notes }
 * @example roundData = {
 *   userId: "cd015f9c-5af5-47ce-ba8c-4ff637f8a2c0",
 *   courseId: 5,
 *   datePlayed: "2025-11-19",
 *   holeScores: [
 *     { holeNumber: 1, strokes: 4, par: 4 },
 *     { holeNumber: 2, strokes: 5, par: 4 }
 *   ],
 *   notes: "Great round!"
 * }
 */
export async function createRound(roundData) {
  return apiFetch('/rounds', {
    method: 'POST',
    body: JSON.stringify(roundData),
  });
}

/**
 * Get all rounds for a user
 * @param {string} userId - User UUID
 */
export async function getUserRounds(userId) {
  return apiFetch(`/rounds/user/${userId}`);
}

/**
 * Get a specific round by ID
 * @param {number} roundId - Round ID
 */
export async function getRoundById(roundId) {
  return apiFetch(`/rounds/${roundId}`);
}

/**
 * Delete a round
 * @param {number} roundId - Round ID
 */
export async function deleteRound(roundId) {
  return apiFetch(`/rounds/${roundId}`, {
    method: 'DELETE',
  });
}

// ============================================
// HEALTH CHECK
// ============================================
>>>>>>> f9df0c1d696a16f8c4bb810918ef4390b0ea1252

export async function checkBackendHealth() {
  return apiFetch('/health');
}