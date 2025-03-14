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

const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_d4dbrnt', 'template_2ejxt28', form.current, 'public_kjhLCa49ByPlH7xGn')
      .then((result) => {
          console.log('SUCCESS!', result.text);
          alert('Message sent successfully!');
      }, (error) => {
          console.error('FAILED...', error.text);
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
      <input type="hidden" name="title" value="General Inquiry" />
      <button type="submit">Send</button>
    </form>
  );
};

// Weather Component with API Fetching
function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
  const location = 'Camarines Sur, Philippines';
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setWeatherData(data.current);
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
    <div className="weather-container">
      <h2>Weather in Camarines Sur</h2>
      <p><strong>Temperature:</strong> {weatherData.temp_c}°C</p>
      <p><strong>Condition:</strong> {weatherData.condition.text}</p>
      <p><strong>Humidity:</strong> {weatherData.humidity}%</p>
      <p><strong>Wind Speed:</strong> {weatherData.wind_kph} kph</p>
      <p><strong>UV Index:</strong> {weatherData.uv}</p>
      <p><strong>Precipitation:</strong> {weatherData.precip_mm} mm</p>
      <img src={weatherData.condition.icon} alt="Weather icon" />
    </div>
  );
}

function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      title: "Ano ang Federation of Agriculture Cooperatives in Camarines Sur (FACCS)? / What is FACCS?",
      answer: "Ang Federation of Agriculture Cooperatives in Camarines Sur (FACCS) ay isang pangalawang kooperatiba na itinatag noong Agosto 15, 2019. Layunin nitong pag-isahin ang mga mapagkumpetensyang, napapanatili, at makabagong teknolohiyang kooperatiba sa agrikultura sa Camarines Sur.",
      answerEnglish: "The Federation of Agriculture Cooperatives in Camarines Sur (FACCS) is a secondary cooperative established on August 15, 2019. It aims to unify competitive, sustainable, and technology-based agriculture cooperatives in Camarines Sur."
    },
    {
      title: "Anong mga serbisyo ang iniaalok ng FACCS? / What services does FACCS offer?",
      answer: "Ang FACCS ay nagbibigay ng iba't ibang serbisyo tulad ng pinansyal na tulong, pagsasanay sa agrikultura, suporta sa pag-access sa merkado, at pagsasama ng teknolohiya upang mapabuti ang ani at pagpapanatili ng sakahan.",
      answerEnglish: "FACCS provides various services including financial assistance, agricultural training, market access support, and technology integration to help farmers enhance productivity and sustainability."
    },
    {
      title: "Paano ako magiging miyembro ng FACCS? / How can I become a member of FACCS?",
      answer: "Upang maging miyembro ng FACCS, kailangang miyembro ka ng isang pangunahing kooperatiba sa Camarines Sur. Maaari kang makipag-ugnayan sa amin sa federation.agricoops.camarinessur@gmail.com o tumawag sa +63 948 933 4240 para sa karagdagang impormasyon.",
      answerEnglish: "To become a member of FACCS, you must be part of a primary cooperative in Camarines Sur. You can contact us at federation.agricoops.camarinessur@gmail.com or call +63 948 933 4240 for more details."
    },
    {
      title: "Paano ako makakakuha ng tulong pinansyal mula sa FACCS? / How can I get financial assistance from FACCS?",
      answer: "Ang FACCS ay nagbibigay ng iba't ibang programa ng tulong pinansyal para sa mga magsasaka. Upang mag-apply, makipag-ugnayan sa amin sa pamamagitan ng federation.agricoops.camarinessur@gmail.com o tumawag sa +63 948 933 4240.",
      answerEnglish: "FACCS offers various financial aid programs for farmers. You may apply by contacting us at federation.agricoops.camarinesur@gmail.com or calling +63 948 933 4240."
    },
    {
      title: "Paano ako makakakuha ng impormasyon sa panahon? / How can I get weather updates?",
      answer: "Maaari mong bisitahin ang aming seksyon na 'Weather' sa website upang makuha ang pinakabagong impormasyon tungkol sa lagay ng panahon sa Camarines Sur.",
      answerEnglish: "You can visit our 'Weather' section on our website to get the latest updates on weather conditions in Camarines Sur."
    },
    {
      title: "Paano makontak ang FACCS? / How can I contact FACCS?",
      answer: "Maaari mo kaming tawagan sa +63 948 933 4240 o i-email sa federation.agricoops.camarinessur@gmail.com. Maaari mo ring bisitahin ang aming opisina sa Naga City, Camarines Sur.",
      answerEnglish: "You can contact us via phone at +63 948 933 4240 or email us at federation.agricoops.camarinessur@gmail.com. You may also visit our office in Naga City, Camarines Sur."
    }
  ];

  return (
    <div className="faqs-container">
      <h1>FAQs / Mga Madalas Itanong</h1>
      {faqs.map((faq, index) => (
        <div key={index} className="faq-item">
          <button onClick={() => toggleFAQ(index)} className="faq-question">
            {faq.title} {openIndex === index ? "▲" : "▼"}
          </button>
          {openIndex === index && (
            <div className="faq-answer">
              <p><strong>🇵🇭 Tagalog:</strong> {faq.answer}</p>
              <p><strong>English:</strong> {faq.answerEnglish}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
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
