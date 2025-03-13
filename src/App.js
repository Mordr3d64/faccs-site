import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.png';
import './App.css';
import React, { useRef, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

function App() {
  return (
    <Router>
      <div className="App">
        <NavPanel />
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

function NavPanel() {
  return (
    <ul className="NavPanel">
      <li className="NavItem">
        <img src={logo} className="App-logo" alt="logo" />
      </li>
      <li className="NavItem"><Link className="NavLink" to="/">Home</Link></li>
      <li className="NavItem"><Link className="NavLink" to="/announcements">Announcements</Link></li>
      <li className="NavItem"><Link className="NavLink" to="/contact">Contact</Link></li>
      <li className="NavItem"><Link className="NavLink" to="/weather">Weather</Link></li>
      <li className="NavItem"><Link className="NavLink" to="/faqs">FAQs</Link></li>
      <li className="NavItem"><Link className="NavLink" to="/admin">Admin</Link></li>
    </ul>
  );
}

function Home() {
  return <p>Welcome to the Home Page!</p>;
}

function Announcements() {
  return <p>Here are the latest announcements.</p>;
}

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    const formData = new FormData(form.current);
    console.log('Form Data:', Object.fromEntries(formData.entries()));

    emailjs.sendForm('service_d4dbrnt', 'template_2ejxt28', form.current, 'kjhLCa49ByPlH7xGn')
      .then((result) => {
        console.log(result.text);
        alert('Message sent successfully!');
      }, (error) => {
        console.log(error.text);
        alert('Failed to send message, please try again later.');
      });

    e.target.reset();
  };

  return (
    <form ref={form} onSubmit={sendEmail} className="contact-form">
      <h2>Contact Us</h2>
      <div>
        <label>Name</label>
        <input type="text" name="name" required />
      </div>
      <div>
        <label>Email</label>
        <input type="email" name="email" required />
      </div>
      <div>
        <label>Message</label>
        <textarea name="message" required></textarea>
      </div>
      <button type="submit">Send</button>
    </form>
  );
};



// Weather Component with API Fetching
function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=13.4088&longitude=122.5615&hourly=temperature_2m,relative_humidity_2m'
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setWeatherData(data.hourly);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return <p>Loading weather data...</p>;
  if (error) return <p>Error fetching weather: {error}</p>;

  return (
    <div>
      <h2>Weather Forecast</h2>
      <p><strong>Temperature:</strong> {weatherData.temperature_2m[0]}°C</p>
      <p><strong>Humidity:</strong> {weatherData.relative_humidity_2m[0]}%</p>
    </div>
  );
}

function FAQs() {
  return <p>Frequently Asked Questions</p>;
}

// Admin Panel
function Admin() {
  const members = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Member', status: 'Active' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'Admin', status: 'Inactive' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Member', status: 'Active' },
    { id: 4, name: 'Nekoarc', email: 'burenyuu@example.com', role: 'Admin', status: 'Active' }
  ];

  return (
    <div>
      <h2>Admin - Member Records</h2>
      <table className="MemberTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
