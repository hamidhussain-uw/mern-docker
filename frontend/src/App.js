import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Users from './pages/Users';
import Posts from './pages/Posts';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              MERN Stack App
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/users" className="nav-link">Users</Link>
              </li>
              <li className="nav-item">
                <Link to="/posts" className="nav-link">Posts</Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/posts" element={<Posts />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
