const axios = require("axios");
require("dotenv").config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY; // Store API key in .env
const BASE_URL = "http://api.weatherapi.com/v1/history.json"; // WeatherAPI base URL

const getWeatherData = async (location, date) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: WEATHER_API_KEY,
        q: location, // Can be city name or coordinates
        dt: date, // Format: YYYY-MM-DD
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    return null;
  }
};

module.exports = { getWeatherData };
