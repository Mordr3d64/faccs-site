import React, { useState, useEffect } from 'react';

function Announcements() {
  const [openAnnouncements, setOpenAnnouncements] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Fetch announcements from the backend
  useEffect(() => {
    fetch('http://localhost:5000/api/announcements')
      .then((res) => res.json())
      .then((data) => setAnnouncements(data))
      .catch((err) => console.error('Error fetching announcements:', err));
  }, []);

  const toggleAnnouncement = (index) => {
    setOpenAnnouncements((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  return (
    <div className="announcements-container">
      <h1>Announcements</h1>
      {announcements.map((announcement, index) => (
        <div key={announcement.id} className="announcement">
          <button onClick={() => toggleAnnouncement(index)} className="announcement-title">
            {announcement.title} {openAnnouncements[index] ? "▲" : "▼"}
          </button>
          {openAnnouncements[index] && (
            <p className="announcement-content">{announcement.content}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default Announcements;