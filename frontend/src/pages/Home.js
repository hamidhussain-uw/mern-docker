import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Home() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get(`${API_URL}/health`);
        setHealth(response.data);
      } catch (error) {
        console.error('Health check failed:', error);
        setHealth({ status: 'error', message: 'Backend is not reachable' });
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="card">
      <h2>Welcome to MERN Stack Application</h2>
      <p>
        This is a full-stack application built with:
      </p>
      <ul style={{ marginTop: '1rem', marginLeft: '2rem' }}>
        <li><strong>MySQL</strong> - Database</li>
        <li><strong>Express</strong> - Backend API</li>
        <li><strong>React</strong> - Frontend Framework</li>
        <li><strong>Node.js</strong> - Runtime Environment</li>
        <li><strong>Docker</strong> - Containerization</li>
      </ul>

      <div style={{ marginTop: '2rem' }}>
        <h3>Backend Status</h3>
        {loading ? (
          <p className="loading">Checking backend connection...</p>
        ) : (
          <div className={health?.status === 'ok' ? 'success' : 'error'}>
            <strong>Status:</strong> {health?.status || 'unknown'}
            <br />
            <strong>Message:</strong> {health?.message || 'No message'}
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Features</h3>
        <ul style={{ marginTop: '1rem', marginLeft: '2rem' }}>
          <li>User Management - Create, Read, Update, Delete users</li>
          <li>Post Management - Create and view posts with user associations</li>
          <li>RESTful API - Full CRUD operations</li>
          <li>Docker Compose - Easy development setup</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
