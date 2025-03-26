import React, { useState, useEffect, useCallback } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import axios from "axios";

const WEATHER_API_KEY = "fc5c8e377e8a87d7fcb9974d83aaeb66"; //// Openweatherapp api key
const URL = "https://api.openweathermap.org/data/2.5/weather";

const Weather = ({ logs, onCloseWeather }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    const { toLocation } = logs;
    const extractLocationNames = toLocation.split(",")[0];
    const trimIfSpaceLocation = extractLocationNames.split(" ")[0];
    const url = `${URL}?q=${trimIfSpaceLocation}&appid=${WEATHER_API_KEY}`;
    try {
      const response = await axios.get(url);
      setWeatherData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }, [logs]);

  return (
    <div className="fixed inset-0 flex w-[800px] h-[500px] m-auto items-center justify-center rounded-2xl bg-black bg-opacity-100 z-50">
      <div className="relative bg-gradient-to-b from-gray-400 to-blue-400 w-[500px] p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <h1>Weather Details</h1>
          <button
            onClick={() => fetchWeather()}
            disabled={weatherData ? true : false}
            className="border-1 p-2 border-gray-400 rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:text-gray-800"
          >
            Fetch Weather
          </button>
          <button
            onClick={() => {
              weatherData && fetchWeather();
            }}
            disabled={weatherData ? false : true}
            className="border-1 p-2 border-gray-400 rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:text-gray-800"
          >
            Refresh
          </button>
          <IoIosCloseCircle
            className="top-0 text-2xl cursor-pointer"
            fill="red"
            onClick={() => {
              onCloseWeather();
              setWeatherData(null);
              setLoading(false);
              setError(null);
            }}
          />
        </div>

        {loading ? (
          <div>Fetching Weather...</div>
        ) : (
          <div>
            {weatherData && (
              <div>
                <h1>Name: {weatherData?.name}</h1>
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData?.weather[0].icon}.png`}
                  alt={weatherData?.name}
                  loading="lazy"
                />
                <p className="text-lg">{weatherData?.weather[0].description}</p>
                <p className="text-lg">🌡️ {weatherData?.main.temp}°C</p>
                <p className="text-lg">
                  💧 Humidity: {weatherData?.main.humidity}%
                </p>
                <p className="text-lg">
                  🌬️ Wind: {weatherData?.wind.speed} m/s
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
