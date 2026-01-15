import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    user_id: ''
  });

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/posts`);
      setPosts(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);

      await axios.post(`${API_URL}/posts`, formData);
      setSuccess('Post created successfully!');
      setFormData({ title: '', content: '', user_id: '' });
      fetchPosts();
    } catch (err) {
      setError('Failed to create post: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Create New Post</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Author *</label>
            <select
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Create Post
          </button>
        </form>
      </div>

      <div className="card">
        <h2>All Posts</h2>
        {loading ? (
          <div className="loading">Loading posts...</div>
        ) : posts.length === 0 ? (
          <p>No posts found. Create your first post above!</p>
        ) : (
          <div>
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  backgroundColor: '#fafafa'
                }}
              >
                <h3 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>
                  {post.title}
                </h3>
                <p style={{ marginBottom: '1rem', color: '#666', lineHeight: '1.6' }}>
                  {post.content}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#999' }}>
                  <span>
                    <strong>Author:</strong> {post.author_name || 'Unknown'}
                  </span>
                  <span>
                    <strong>Created:</strong> {new Date(post.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Posts;
