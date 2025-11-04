import './App.css';
import CourseSearch from './components/CourseSearch';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>⛳ Golf Course Finder</h1>
        <p>Search for golf courses across the United States</p>
        
        <button>Log games</button>
      </header>
      
      <main>
        <CourseSearch />
      </main>
      
      <footer>
        <p>Powered by GolfCourseAPI</p>
      </footer>
    </div>
  );
}

export default App;