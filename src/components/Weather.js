import React, { useState, useEffect } from 'react';

function Weather() {
  const locations = {
    "Camarines Sur": "Naga,Philippines",
    "Manila": "Manila,Metro+Manila,Philippines",
    "Davao": "Davao,Philippines",
    "Cebu": "Cebu+City,Philippines",
    "Baguio": "Baguio+City,Philippines",
  };

  // Coordinates for fallback API
  const coordinates = {
    "Camarines Sur": { lat: 13.6192, lon: 123.1814 },
    "Manila": { lat: 14.5995, lon: 120.9842 },
    "Davao": { lat: 7.1907, lon: 125.4553 },
    "Cebu": { lat: 10.3157, lon: 123.8854 },
    "Baguio": { lat: 16.4023, lon: 120.5960 },
  };

  const [selectedLocation, setSelectedLocation] = useState("Camarines Sur");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      setUsingFallback(false);

      try {
        // Try primary API first
        const encodedLocation = encodeURIComponent(locations[selectedLocation]);
        const apiUrl = `https://wttr.in/${encodedLocation}?format=%C|%t|%h|%w|%u|%p`;
        
        const response = await fetch(apiUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0' // Some APIs require user agent
          }
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const textData = await response.text();
        const [condition, temperature, humidity, wind, uv, precipitation] = textData.split("|");

        setWeatherData({ 
          condition, 
          temperature, 
          humidity, 
          wind, 
          uv, 
          precipitation,
          imageUrl: `https://wttr.in/${encodedLocation}_0pq.png?${Date.now()}` // Cache busting
        });
      } catch (primaryError) {
        console.warn('Primary API failed, trying fallback:', primaryError);
        setUsingFallback(true);
        tryFallback();
      } finally {
        setLoading(false);
      }
    };

    const tryFallback = async () => {
      try {
        // Get coordinates for the selected location
        const { lat, lon } = coordinates[selectedLocation];
        
        // Fallback to a different weather API with location-specific coordinates
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        
        if (!response.ok) throw new Error('Fallback API failed');
        
        const data = await response.json();
        setWeatherData({
          condition: getWeatherCondition(data.current_weather.weathercode),
          temperature: `${data.current_weather.temperature}°C`,
          humidity: 'N/A',
          wind: `${data.current_weather.windspeed} km/h`,
          uv: 'N/A',
          precipitation: 'N/A',
          imageUrl: getWeatherIcon(data.current_weather.weathercode)
        });
      } catch (fallbackError) {
        console.error('Fallback failed:', fallbackError);
        setError('Weather service is currently unavailable. Please try again later.');
      }
    };

    const getWeatherIcon = (code) => {
      // Simple mapping of weather codes to icons
      const icons = {
        0: '☀️',  // Clear sky
        1: '🌤️',  // Mainly clear
        2: '⛅',  // Partly cloudy
        3: '☁️',  // Overcast
        45: '🌫️', // Fog
        61: '🌧️', // Rain
        80: '🌦️', // Showers
      };
      return icons[code] || '🌈';
    };

    const getWeatherCondition = (code) => {
      // Mapping of weather codes to text descriptions
      const conditions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail',
      };
      return conditions[code] || 'Unknown';
    };

    fetchWeather();
  }, [selectedLocation]);

  return (
    <div className="weather-container">
      <h2>Weather Forecast {usingFallback && '(Using Fallback)'}</h2>
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
      {error && <div className="error">{error}</div>}
      
      {weatherData && (
        <div className="weather-info">
          <div className="weather-header">
            <h3>{selectedLocation}</h3>
            {weatherData.imageUrl && (
              typeof weatherData.imageUrl === 'string' && weatherData.imageUrl.startsWith('http') ? (
                <img 
                  src={weatherData.imageUrl} 
                  alt={`Weather in ${selectedLocation}`} 
                  className="weather-icon"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <span className="weather-emoji">{weatherData.imageUrl}</span>
              )
            )}
          </div>
          <div className="weather-details">
            <div className="weather-detail-item">
              <span className="label">Condition:</span>
              <span className="value">{weatherData.condition || 'N/A'}</span>
            </div>
            <div className="weather-detail-item">
              <span className="label">Temperature:</span>
              <span className="value">{weatherData.temperature || 'N/A'}</span>
            </div>
            <div className="weather-detail-item">
              <span className="label">Humidity:</span>
              <span className="value">{weatherData.humidity || 'N/A'}</span>
            </div>
            <div className="weather-detail-item">
              <span className="label">Wind:</span>
              <span className="value">{weatherData.wind || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Weather;