const API_BASE_URL = 'https://project3-0f9437dc4342.herokuapp.com/api';

async function apiFetch(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
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
      const error = new Error(errorText || `API Error: ${response.status}`);
      error.status = response.status;
      error.response = errorText;
      throw error;
    }

    return await response.json();
  } catch (error) {
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

export async function getUserByEmail(email) {
  return apiFetch(`/auth/user-by-email?email=${encodeURIComponent(email)}`);
}

export async function signInWithGoogle(idToken) {
  return apiFetch('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  });
}

export async function createRound(roundData) {
  return apiFetch('/rounds', {
    method: 'POST',
    body: JSON.stringify(roundData),
  });
}

export async function getUserRounds(userId) {
  return apiFetch(`/rounds/user/${userId}`);
}

export async function getRoundById(roundId) {
  return apiFetch(`/rounds/${roundId}`);
}

export async function deleteRound(roundId) {
  return apiFetch(`/rounds/${roundId}`, {
    method: 'DELETE',
  });
}

export async function checkBackendHealth() {
  return apiFetch('/health');
}