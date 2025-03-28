import React from 'react';
import { Carousel } from 'react-responsive-carousel'; // Import Carousel component
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import the carousel CSS styles

// Import images from the 'assets/images' folder
import image1 from '../images/image1.jpg';
import image2 from '../images/image2.jpg';
import image3 from '../images/image3.jpg';
import image4 from '../images/image4.jpg'; 

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
            <div>
              <img src={image4} alt="Image 4" /> 
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
}

export default Home;
