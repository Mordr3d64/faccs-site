import React from 'react';

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-text">
          <h1>Federation of Agriculture Cooperatives in Camarines Sur</h1>
          <div className="mission-section">
            <h2>Our Mission</h2>
            <p className="mission-text">
              "To build the financial, technical, and marketing capabilities of agricultural cooperatives through the delivery of quality products and services."
            </p>
          </div>
        </div>
        <div className="home-image">
          <img src="https://placehold.co/600x400" alt="FACCS" />
        </div>
      </div>
    </div>
  );
}

export default Home; 