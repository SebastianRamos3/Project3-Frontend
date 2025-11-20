const API_BASE_URL = typeof window !== 'undefined' 
  ? 'http://localhost:8080/api'
  : 'http://10.0.0.200:8080/api';


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

export async function loginWithGoogle(idToken) {
  return apiFetch('/auth/oauth/google', {
    method: 'POST',
    body: JSON.stringify({
      idToken: idToken,
      provider: 'google',
    }),
  });
}

export async function checkBackendHealth() {
  return apiFetch('/health');
}