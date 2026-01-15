import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);

      if (editingUser) {
        await axios.put(`${API_URL}/users/${editingUser.id}`, formData);
        setSuccess('User updated successfully!');
      } else {
        await axios.post(`${API_URL}/users`, formData);
        setSuccess('User created successfully!');
      }

      setFormData({ name: '', email: '', age: '' });
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError('Failed to save user: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      age: user.age || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/users/${id}`);
      setSuccess('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', age: '' });
  };

  return (
    <div>
      <div className="card">
        <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              min="0"
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary">
              {editingUser ? 'Update User' : 'Create User'}
            </button>
            {editingUser && (
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Users List</h2>
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : users.length === 0 ? (
          <p>No users found. Create your first user above!</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.age || 'N/A'}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(user)}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(user.id)}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Users;
