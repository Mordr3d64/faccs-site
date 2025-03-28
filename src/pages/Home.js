import React from 'react';
import image1 from '../assets/images/image1.jpg'; // Import images
import image2 from '../assets/images/image2.jpg';
import image3 from '../assets/images/image3.jpg';
import image3 from '../assets/images/image4.jpg';

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

        {/* Photo Carousel Section */}
        <div className="home-carousel">
          <Carousel>
            <div>
              <img src={image1} alt="Image 1" />
            </div>
            <div>
              <img src={image2} alt="Image 2" />
            </div>
            <div>
              <img src={image3} alt="Image 3" />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
}

export default Home;
