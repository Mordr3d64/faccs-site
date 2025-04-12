import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Admin() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  
  // Add User State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member',
    status: 'active'
  });

  // Delete User State
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      if (!response.ok) throw new Error('Failed to fetch members');
      
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setShowAddForm(true);
    setShowDeleteConfirmation(false);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirmation(true);
    setShowAddForm(false);
  };

  const cancelAdd = () => {
    setShowAddForm(false);
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'member',
      status: 'active'
    });
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setUserToDelete(null);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to add user');
      }

      const data = await response.json();
      setMembers(prev => [...prev, data]);
      cancelAdd();
    } catch (err) {
      setError(err.message);
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userToDelete.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setMembers(prev => prev.filter(user => user.id !== userToDelete.id));
      cancelDelete();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading members...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Panel - Welcome {currentUser?.name}</h2>
        <button onClick={logout} className="logout-button">Logout</button>
      </div>
      
      {/* Action Buttons */}
      <div className="admin-actions">
        {!showAddForm && (
          <button onClick={handleAddClick} className="add-button">
            Add New User
          </button>
        )}
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className="add-user-form">
          <h3>Add New User</h3>
          <form onSubmit={handleAddUser}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Role:</label>
              <select
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status:</label>
              <select
                name="status"
                value={newUser.status}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">Save</button>
              <button type="button" onClick={cancelAdd} className="cancel-btn">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirmation && (
        <div className="delete-confirmation">
          <h3>Confirm Deletion</h3>
          <p>Are you sure you want to delete user: <strong>{userToDelete.name}</strong> ({userToDelete.email})?</p>
          <div className="form-actions">
            <button onClick={confirmDelete} className="delete-btn">Delete</button>
            <button onClick={cancelDelete} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}

      {/* Members Table */}
      <table className="member-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.id}</td>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.role}</td>
              <td>{member.status}</td>
              <td>
                <button 
                  onClick={() => handleDeleteClick(member)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;