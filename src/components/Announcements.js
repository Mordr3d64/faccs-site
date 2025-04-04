import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function AnnouncementForm({ announcement, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: announcement ? announcement.title : '',
    content: announcement ? announcement.content : ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="announcement-edit-form">
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Content</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          className="form-textarea"
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="save-btn">Save Changes</button>
        <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
      </div>
    </form>
  );
}

function Announcements() {
  const { isAuthenticated } = useAuth();
  const [openAnnouncements, setOpenAnnouncements] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:5000/api/announcements');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch announcements');
      }
      
      const data = await response.json();
      setAnnouncements(data);
      setOpenAnnouncements(new Array(data.length).fill(false));
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load announcements. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchAnnouncements(); 
  }, []);

  const toggleAnnouncement = (index) => {
    setOpenAnnouncements(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/announcements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.details || result.error || 'Update failed');
      }

      setAnnouncements(prev => 
        prev.map(ann => 
          ann.id === result.id ? result : ann
        )
      );
      setEditingId(null);
    } catch (err) {
      console.error('Update failed:', err);
      setError(`Update failed: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/announcements/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Delete failed');
      }

      setAnnouncements(prev => prev.filter(ann => ann.id !== id));
      setError('');
    } catch (err) {
      console.error('Delete failed:', err);
      setError(`Delete failed: ${err.message}`);
    }
  };

  if (loading) return <div className="announcements-loading">Loading announcements...</div>;
  if (error) return <div className="announcements-error">{error}</div>;

  return (
    <div className="announcements-container">
      <h1 className="announcements-main-title">Announcements</h1>
      
      {isAuthenticated && (
        <div className="announcements-admin-controls">
          <button 
            onClick={() => window.location.href = '/add-announcement'}
            className="announcements-add-button"
          >
            Add New Announcement
          </button>
        </div>
      )}

      {announcements.length === 0 ? (
        <p className="announcements-empty">No announcements available</p>
      ) : (
        announcements.map((announcement, index) => (
          <div key={announcement.id} className="announcement-card">
            {editingId === announcement.id ? (
              <AnnouncementForm
                announcement={announcement}
                onSave={(data) => handleSaveEdit(announcement.id, data)}
                onCancel={handleCancelEdit}
              />
            ) : (
              <>
                <div className="announcement-header">
                  <button 
                    onClick={() => toggleAnnouncement(index)} 
                    className="announcement-title-button"
                  >
                    {announcement.title} {openAnnouncements[index] ? "▲" : "▼"}
                  </button>
                  
                  {isAuthenticated && (
                    <div className="announcement-admin-actions">
                      <button 
                        className="announcement-edit-btn"
                        onClick={() => handleEdit(announcement.id)}
                      >
                        Edit
                      </button>
                      <button 
                        className="announcement-delete-btn"
                        onClick={() => handleDelete(announcement.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                
                {openAnnouncements[index] && (
                  <div className="announcement-body">
                    <p className="announcement-content">{announcement.content}</p>
                    <div className="announcement-footer">
                      <span className="announcement-date">
                        Posted: {new Date(announcement.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Announcements;