import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
      <li><img src={logo} className="App-logo" alt="logo" /></li>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/announcements">Announcements</Link></li>
      <li><Link to="/contact">Contact</Link></li>
      <li><Link to="/weather">Weather</Link></li>
      <li><Link to="/faqs">FAQs</Link></li>
      <li><Link to="/admin">Admin Login</Link></li>
    </ul>
  );
}

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

//admin panel
function Admin() {
  //temp data for member records
  const members = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Member', status: 'Active' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'Admin', status: 'Inactive' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Member', status: 'Active' },
  ];

  return (
    <div>
      <h2>Admin - Member Records</h2>
      <table border="1" cellPadding="8" style={{ margin: 'auto', width: '80%', borderCollapse: 'collapse' }}>
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
