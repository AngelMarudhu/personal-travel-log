import React, { useState } from "react";
import { createTraveLog } from "../Features/TravelLogFeature";
import { useDispatch, useSelector } from "react-redux";
import useImageUpload from "../CustomHooks/useImageUpload";
import { debounce } from "lodash";

const CreateLog = () => {
  const [place, setPlace] = useState({
    newPlace: "",
  });
  const [autoCompleteLocation, setAutoCompleteLocation] = useState([]);
  const [handleField, setHandleField] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState({
    fromLat: "",
    fromLng: "",
    toLat: "",
    toLng: "",
  });
  const [distance, setDistance] = useState(null);
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.travelLog);

  const [log, setLog] = useState({
    title: "",
    description: "",
    toLocation: "",
    fromLocation: "",
    cost: "",
    date: "",
    placesToVisit: [],
    coordinates: {
      latitute: null,
      longitude: null,
    },
  });

  const { error, handleImageChange, isUploading, uploadImages, uploadedUrls } =
    useImageUpload();

  const fetchAutoCompleteLocations = async (query) => {
    const LOCATION_API_KEY = "pk.dca6843e12f720c179835eaa8f74ab3e"; //// LOCATIONIQ API KEY
    if (!query) return;
    try {
      if (query.length < 3) return;
      const response = await fetch(
        `https://us1.locationiq.com/v1/autocomplete.php?key=${LOCATION_API_KEY}&q=${query}&limit=3&format=json`
      );
      const data = await response.json();
      setAutoCompleteLocation(data);
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedSearch = debounce(fetchAutoCompleteLocations, 1000);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "fromLocation") {
      if (value.length > 3) {
        debouncedSearch(value);
      } else {
        setAutoCompleteLocation([]);
      }
    }

    if (name === "toLocation") {
      if (value.length > 3) {
        debouncedSearch(value);
      } else {
        setAutoCompleteLocation([]);
      }
    }

    setLog((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleToPlacesVisit = (e) => {
    const { value } = e.target;
    setPlace({
      newPlace: value,
    });
  };

  const handleAddPlace = (e) => {
    e.preventDefault();

    if (place.newPlace.trim()) {
      setLog({
        ...log,
        placesToVisit: [...log.placesToVisit, place.newPlace],
      });
    }
    setPlace({
      newPlace: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      createTraveLog({
        ...log,
        placesToVisit: JSON.stringify(log.placesToVisit),
        images: uploadedUrls,
        location: {
          type: "Point",
          coordinates: [log.coordinates.latitute, log.coordinates.longitude],
        },
      })
    );

    // console.log(log);
  };

  const getGeoLocation = (e) => {
    e.preventDefault();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log({ latitude, longitude });
          setLog((prev) => {
            return {
              ...prev,
              coordinates: {
                latitute: latitude,
                longitude: longitude,
              },
            };
          });
          alert("Location fetched successfully");
        },
        (error) => {
          alert("Failed to get your location please allow location access");
        }
      );
    } else {
      alert("GeoLocation is not supported");
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setLog((prev) => {
      return {
        ...prev,
        [handleField]: suggestion.display_name,
      };
    });

    if (handleField === "fromLocation") {
      setSelectedLocation((prev) => {
        return {
          ...prev,
          fromLat: parseFloat(suggestion.lat),
          fromLng: parseFloat(suggestion.lon),
        };
      });
    } else {
      setSelectedLocation((prev) => {
        return {
          ...prev,
          toLat: parseFloat(suggestion.lat),
          toLng: parseFloat(suggestion.lon),
        };
      });
    }

    setAutoCompleteLocation([]);
  };

  const getDistanceOfLocation = () => {
    const { fromLat, fromLng, toLat, toLng } = selectedLocation;

    if (fromLat && fromLng && toLat && toLng) {
      const latDiff = toLat - fromLat;
      const lngDiff = toLng - fromLng;

      const kmPerDegreeLat = 111; // Approx distance per degree of latitude in km
      const kmPerDegreeLng = 111 * Math.cos(fromLat * (Math.PI / 180)); // Adjust for longitude

      const xDiffKm = latDiff * kmPerDegreeLat;
      const yDiffKm = lngDiff * kmPerDegreeLng;

      const distance = Math.sqrt(xDiffKm * xDiffKm + yDiffKm * yDiffKm);
      setDistance(distance.toFixed(2));
    } else {
      alert("Please select both locations with valid coordinates");
    }
  };

  return (
    <div>
      <h1 className="text-center w-full mb-2 border-b-2">
        Share Your Experience
      </h1>
      <div>
        <form action="" onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            onChange={handleChange}
            value={log.title}
            required
            name="title"
            placeholder="Title"
          />
          <input
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            onChange={handleChange}
            value={log.description}
            required
            name="description"
            placeholder="Description"
          />

          <input
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            onChange={handleChange}
            onFocus={() => {
              setHandleField("fromLocation");
            }}
            value={log.fromLocation}
            required
            name="fromLocation"
            placeholder="From Location"
          />

          {autoCompleteLocation.length > 0 && (
            <ul>
              {autoCompleteLocation.map((location, index) => {
                return (
                  <li
                    onClick={(e) => handleSelectSuggestion(location)}
                    className="p-2 hover:bg-gray-200 cursor-pointer rounded-lg"
                    key={index}
                  >
                    {location.display_name}
                  </li>
                );
              })}
            </ul>
          )}

          <input
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            onChange={handleChange}
            value={log.toLocation}
            onFocus={() => {
              setHandleField("toLocation");
            }}
            required
            name="toLocation"
            placeholder="To Location"
          />

          <button className="text-cyan-600" onClick={getDistanceOfLocation}>
            Get Distance:{" "}
            <span className="text-black">
              {distance ? `${distance}` : "Enter Location"}
            </span>
          </button>

          <input
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="number"
            onChange={handleChange}
            required
            value={log.cost}
            name="cost"
            placeholder="Cost"
          />
          <input
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="date"
            name="date"
            value={log.date}
            required
            onChange={handleChange}
            placeholder="Date"
          />
          <div className="flex justify-between items-center">
            <input
              type="text"
              onChange={handleToPlacesVisit}
              placeholder="Add a place to visit"
              value={place.newPlace}
              name="placesToVisit"
              className=" p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              className="w-auto p-3 border-2 rounded-2xl text-sm cursor-pointer"
              type="button"
              onClick={(e) => handleAddPlace(e)}
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {log.placesToVisit?.join(", ")}
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <input
            type="file"
            name="image"
            multiple={true}
            accept="image/*"
            id="image"
            onChange={(e) => handleImageChange(e)}
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg cursor-pointer"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => getGeoLocation(e)}
              className="w-full px-6 p-2 border-2 rounded-2xl text-md cursor-pointer"
            >
              Get Location
            </button>
            <button
              type="button"
              onClick={uploadImages}
              disabled={isUploading}
              className="w-full px-6 p-2 border-2 rounded-2xl text-md cursor-pointer"
            >
              {isUploading ? "Uploading..." : "Upload Images"}
            </button>
          </div>

          {log.coordinates.latitute && log.coordinates.longitude && (
            <div>
              <p>Latitude: {log.coordinates.latitute}</p>
              <p>Longitude: {log.coordinates.longitude}</p>
            </div>
          )}

          <button
            className="w-full px-6 p-2 border-2 rounded-2xl text-md cursor-pointer"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : " Create Log"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLog;
