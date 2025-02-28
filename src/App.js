import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
       <NavPanel />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          <MyButton />
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
  
          Learn React
        </a>
      </header>
    </div>
  );
}

function MyButton() {
  return (
  <button className="MyButton">ayo</button>
  );
}

function NavPanel() {
  return (
  <ul className="NavPanel">
  <li><a href="#home">Home</a></li>
  <li><a href="#news">Announcements</a></li>
  <li><a href="#contact">Contact</a></li>
  <li><a href="#about">Weather</a></li>
  <li><a href="#about">FAQs</a></li>
</ul>
  )
}

export default App;
