import { useState } from 'react';
import './App.css';
import CourseSearch from './components/CourseSearch';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    // Simple fake login - no backend needed yet
    // In real app, you'd verify credentials here
    setUser({ email, name: email.split('@')[0] });
    setIsLoggedIn(true);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    // Simple fake signup - no backend needed yet
    // In real app, you'd create account in database here
    alert(`Account created for ${name}! Now logging you in...`);
    setUser({ email, name });
    setIsLoggedIn(true);
    setShowSignup(false);
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
                placeholder="Password"
                minLength="6"
                required
              />
              <button type="submit">Create Account</button>
            </form>
            
            <p className="login-note">
              Already have an account?{' '}
              <button 
                onClick={() => setShowSignup(false)} 
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
              <button type="submit">Sign In</button>
            </form>
            
            <p className="login-note">
              Don't have an account?{' '}
              <button 
                onClick={() => setShowSignup(true)} 
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
        <div className="header-content">
          <div>
            <h1>⛳ Golf Course Finder</h1>
            <p>Search for golf courses across the United States</p>
          </div>
          <div className="user-info">
            <span>Welcome, {user.name}!</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
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