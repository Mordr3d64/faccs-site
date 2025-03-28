import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Announcements() {
  const { isAuthenticated } = useAuth();
  const [openAnnouncements, setOpenAnnouncements] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/announcements');
      
      if (!response) throw new Error('No response from server');
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      
      const data = await response.json();
      setAnnouncements(data);
      setOpenAnnouncements(new Array(data.length).fill(false));
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load announcements. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const toggleAnnouncement = (index) => {
    setOpenAnnouncements(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
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
            <div className="announcement-header">
              <button 
                onClick={() => toggleAnnouncement(index)} 
                className="announcement-title-button"
              >
                {announcement.title} {openAnnouncements[index] ? "▲" : "▼"}
              </button>
              
              {isAuthenticated && (
                <div className="announcement-admin-actions">
                  <button className="announcement-edit-btn">Edit</button>
                  <button className="announcement-delete-btn">Delete</button>
                </div>
              )}
            </div>
            
            {openAnnouncements[index] && (
              <div className="announcement-body">
                <p className="announcement-content">{announcement.content}</p>
                <div className="announcement-footer">
                  <span className="announcement-date">
                    {new Date(announcement.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Announcements;