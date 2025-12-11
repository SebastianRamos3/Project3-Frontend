// Production Heroku URL
const API_BASE_URL = 'https://project3-0f9437dc4342.herokuapp.com/api';
// Local development URLs (uncomment to use):
//const API_BASE_URL = 'http://10.0.0.195:8080/api'; // local development (physical device/Android emulator)
//const API_BASE_URL = 'http://localhost:8080/api'; // iOS Simulator only


console.log('API Base URL:', API_BASE_URL);

async function apiFetch(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Fetching:', url);
    console.log('Options:', JSON.stringify(options, null, 2));
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorText;
      try {
        const errorJson = await response.json();
        errorText = errorJson.error || JSON.stringify(errorJson);
      } catch (e) {
        errorText = await response.text();
      }
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      const error = new Error(errorText || `API Error: ${response.status}`);
      error.status = response.status;
      error.response = errorText;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
}


export async function getAllCourses() {
  return apiFetch('/courses');
}

/**
 * Search courses by name
 * @param {string} searchQuery - The search term
 */
export async function searchCourses(searchQuery) {
  return apiFetch(`/courses/search?name=${encodeURIComponent(searchQuery)}`);
}

/**
 * Get course by ID
 * @param {number} id - Course ID
 */
export async function getCourseById(id) {
  return apiFetch(`/courses/${id}`);
}

/**
 * Get courses by city
 * @param {string} city - City name
 */
export async function getCoursesByCity(city) {
  return apiFetch(`/courses/city/${encodeURIComponent(city)}`);
}

/**
 * Get courses by state
 * @param {string} state - State name
 */
export async function getCoursesByState(state) {
  return apiFetch(`/courses/state/${encodeURIComponent(state)}`);
}

/**
 * Create a new course
 * @param {object} courseData - Course object
 */
export async function createCourse(courseData) {
  return apiFetch('/courses', {
    method: 'POST',
    body: JSON.stringify(courseData),
  });
}

/**
 * Update a course
 * @param {number} id - Course ID
 * @param {object} courseData - Updated course object
 */
export async function updateCourse(id, courseData) {
  return apiFetch(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(courseData),
  });
}

/**
 * Delete a course
 * @param {number} id - Course ID
 */
export async function deleteCourse(id) {
  return apiFetch(`/courses/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Get total count of courses
 */
export async function getCoursesCount() {
  return apiFetch('/courses/count');
}

// ============================================
// GOLF API (External API) ENDPOINTS
// ============================================

/**
 * Import courses from external Golf API
 * @param {string} searchQuery - Search term for external API
 */
export async function importCoursesFromExternalApi(searchQuery) {
  return apiFetch(`/golf-api/import?search=${encodeURIComponent(searchQuery)}`);
}

/**
 * Fetch a specific course from external API
 * @param {number} courseId - External course ID
 */
export async function fetchExternalCourse(courseId) {
  return apiFetch(`/golf-api/fetch/${courseId}`);
}

/**
 * Check external API health
 */
export async function checkExternalApiHealth() {
  return apiFetch('/golf-api/health');
}

// ============================================
// AUTH ENDPOINTS
// ============================================

/**
 * Sign up a new user
 * @param {object} userData - { name, email, password }
 */
export async function signUp(userData) {
  return apiFetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/**
 * Login a user
 * @param {object} credentials - { email, password }
 */
export async function login(credentials) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * Get user by email
 * @param {string} email - User email
 */
export async function getUserByEmail(email) {
  return apiFetch(`/auth/user-by-email?email=${encodeURIComponent(email)}`);
}

/**
 * Sign in with Google OAuth
 * @param {string} idToken - Google ID token from OAuth flow
 */
export async function signInWithGoogle(idToken) {
  return apiFetch('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  });
}

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

/**
 * Check if backend is running
 */
export async function checkBackendHealth() {
  return apiFetch('/health');
}