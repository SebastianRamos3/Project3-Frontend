import { useState } from 'react';
import './App.css';
import CourseSearch from './components/CourseSearch';
import { signup, login } from './services/authService';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    try {
      const userData = await login(email, password);
      setUser(userData);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    try {
      const userData = await signup(name, email, password);
      setUser(userData);
      setIsLoggedIn(true);
      setShowSignup(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  // Show signup page
  if (showSignup && !isLoggedIn) {
    return (
      <div className="App">
        <div className="login-container">
          <div className="login-box">
            <h1>⛳ Create Account</h1>
            <p>Join Golf Course Tracker</p>
            
            {error && <div className="error-box">{error}</div>}
            
            <form onSubmit={handleSignup} className="login-form">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password (min 6 characters)"
                minLength="6"
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            
            <p className="login-note">
              Already have an account?{' '}
              <button 
                onClick={() => {
                  setShowSignup(false);
                  setError('');
                }} 
                className="link-btn"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show login page if not logged in
  if (!isLoggedIn) {
    return (
      <div className="App">
        <div className="login-container">
          <div className="login-box">
            <h1>⛳ Golf Course Tracker</h1>
            <p>Sign in to continue</p>
            
            {error && <div className="error-box">{error}</div>}
            
            <form onSubmit={handleLogin} className="login-form">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            
            <p className="login-note">
              Don't have an account?{' '}
              <button 
                onClick={() => {
                  setShowSignup(true);
                  setError('');
                }} 
                className="link-btn"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show main app if logged in
  return (
    <div className="App">
      <header className="App-header">
        <h1>⛳ Golf Course Finder</h1>
        <p>Search for golf courses across the United States</p>
        
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