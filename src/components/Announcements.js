import React, { useState } from 'react';

function Announcements() {
  const [openAnnouncements, setOpenAnnouncements] = useState([]);

  const toggleAnnouncement = (index) => {
    setOpenAnnouncements((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const announcements = [
    { title: "New Government Support for Farmers", content: "The Department of Agriculture has announced new financial aid programs for local farmers." },
    { title: "FACCS Annual General Meeting", content: "Join us for our yearly meeting to discuss upcoming projects and cooperative strategies." },
    { title: "Weather Alert: Typhoon Advisory", content: "A tropical storm is approaching, and we advise all farmers to secure their crops and equipment." },
  ];

  return (
    <div className="announcements-container">
      <h1>Announcements</h1>
      {announcements.map((announcement, index) => (
        <div key={index} className="announcement">
          <button onClick={() => toggleAnnouncement(index)} className="announcement-title">
            {announcement.title} {openAnnouncements[index] ? "▲" : "▼"}
          </button>
          {openAnnouncements[index] && <p className="announcement-content">{announcement.content}</p>}
        </div>
      ))}
    </div>
  );
}

export default Announcements; 