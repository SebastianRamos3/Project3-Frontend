const API_BASE_URL = 'https://api.golfcourseapi.com/v1';
const API_KEY = '3YRM7OUXVN2QX3XCSK2YKOYMWA';

const fetchWithAuth = async (endpoint, options = {}) => {
  const headers = {
    'Authorization': `Key ${API_KEY}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('API key is missing or invalid');
    }
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

/**
 * Search for golf courses by name or club name
 * @param {string} searchQuery - Search term (e.g., "pinehurst")
 * @returns {Promise<Object>} - Array of courses
 */
export const searchGolfCourses = async (searchQuery) => {
  try {
    const data = await fetchWithAuth(`/search?search_query=${encodeURIComponent(searchQuery)}`);
    return data;
  } catch (error) {
    console.error('Error searching golf courses:', error);
    throw error;
  }
};

/**
 * Get detailed information about a specific golf course
 * @param {number} courseId - The ID of the golf course
 * @returns {Promise<Object>} - Course details
 */
export const getCourseById = async (courseId) => {
  try {
    const data = await fetchWithAuth(`/courses/${courseId}`);
    return data;
  } catch (error) {
    console.error('Error fetching course details:', error);
    throw error;
  }
};

/**
 * Check API health status
 * @returns {Promise<Object>} - Health check status
 */
export const getHealthCheck = async () => {
  try {
    const data = await fetchWithAuth('/healthcheck');
    return data;
  } catch (error) {
    console.error('Error checking API health:', error);
    throw error;
  }
};

export default {
  searchGolfCourses,
  getCourseById,
  getHealthCheck,
};