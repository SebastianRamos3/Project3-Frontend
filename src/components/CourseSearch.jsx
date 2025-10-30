import { useState } from 'react';
import { searchGolfCourses } from '../services/golfCourseService';

const CourseSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await searchGolfCourses(searchTerm);
      setCourses(data.courses || []);
      
      if (!data.courses || data.courses.length === 0) {
        setError('No courses found. Try a different search term.');
      }
    } catch (err) {
      setError(err.message || 'Failed to search courses. Check your API key.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-search">
      <h2>Search Golf Courses</h2>
      
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by course or club name..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {courses.length > 0 && (
        <div className="courses-list">
          <h3>Found {courses.length} course(s):</h3>
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <h4>{course.course_name}</h4>
              <p><strong>Club:</strong> {course.club_name}</p>
              <p><strong>Location:</strong> {course.location?.city}, {course.location?.state}</p>
              <p><strong>Address:</strong> {course.location?.address}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseSearch;