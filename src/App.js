import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.png';
import './App.css';

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
          </Routes>
        </header>
      </div>
    </Router>
  );
}

function MyButton() {
  return <button className="MyButton">ayo</button>;
}

function NavPanel() {
  return (
    <ul className="NavPanel">
      <li><img src={logo} className="App-logo" alt="logo" /></li>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/announcements">Announcements</Link></li>
      <li><Link to="/contact">Contact</Link></li>
      <li><Link to="/weather">Weather</Link></li>
      <li><Link to="/faqs">FAQs</Link></li>
    </ul>
  );
}

// These are placeholder components for now
function Home() {
  return <p>Welcome to the Home Page!</p>;
}

function Announcements() {
  return <p>Here are the latest announcements.</p>;
}

function Contact() {
  return <p>Contact us at email@example.com</p>;
}

function Weather() {
  return <p>Check out the weather forecast here.</p>;
}

function FAQs() {
  return <p>Frequently Asked Questions</p>;
}

export default App;
