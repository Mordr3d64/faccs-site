import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AddAnnouncement() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add announcement');
      }

      navigate('/announcements');
    } catch (err) {
      console.error('Add announcement error:', err);
      setError(err.message || 'Failed to add announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-announcement-container">
      <h1>Add New Announcement</h1>
      {error && <div className="announcements-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="form-textarea"
          />
        </div>
        <div className="form-actions">
          <button type="submit" disabled={loading} className="save-btn">
            {loading ? 'Adding...' : 'Add Announcement'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/announcements')} 
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddAnnouncement;