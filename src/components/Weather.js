import React, { useState, useEffect } from 'react';

function Weather() {
  const locations = {
    "Camarines Sur": "Camarines Sur",
    "Manila": "Manila",
    "Davao": "Davao",
    "Cebu": "Cebu",
    "Baguio": "Baguio",
  };

  const [selectedLocation, setSelectedLocation] = useState("Camarines Sur");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://wttr.in/${locations[selectedLocation]}?format=%C|%t|%h|%w|%u|%p`
        );

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const textData = await response.text();
        const [condition, temperature, humidity, wind, uv, precipitation] = textData.split("|");

        setWeatherData({ condition, temperature, humidity, wind, uv, precipitation });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [selectedLocation]);

  return (
    <div className="weather-container">
      <h2>Weather Forecast</h2>
      <div className="location-selector">
        <select 
          onChange={(e) => setSelectedLocation(e.target.value)} 
          value={selectedLocation}
        >
          {Object.keys(locations).map((place) => (
            <option key={place} value={place}>{place}</option>
          ))}
        </select>
      </div>

      {loading && <div className="loading">Loading weather data...</div>}
      {error && <div className="error">Error fetching weather: {error}</div>}
      {weatherData && (
        <div className="weather-info">
          <div className="weather-header">
            <h3>{selectedLocation}</h3>
            <img 
              src={`https://wttr.in/${locations[selectedLocation]}_0.png`} 
              alt="Weather icon" 
              className="weather-icon"
            />
          </div>
          <div className="weather-details">
            <div className="weather-detail-item">
              <span className="label">Temperature</span>
              <span className="value">{weatherData.temperature}</span>
            </div>
            <div className="weather-detail-item">
              <span className="label">Condition</span>
              <span className="value">{weatherData.condition}</span>
            </div>
            <div className="weather-detail-item">
              <span className="label">Humidity</span>
              <span className="value">{weatherData.humidity}</span>
            </div>
            <div className="weather-detail-item">
              <span className="label">Wind Speed</span>
              <span className="value">{weatherData.wind}</span>
            </div>
            <div className="weather-detail-item">
              <span className="label">UV Index</span>
              <span className="value">{weatherData.uv}</span>
            </div>
            <div className="weather-detail-item">
              <span className="label">Precipitation</span>
              <span className="value">{weatherData.precipitation}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Weather; 