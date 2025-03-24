import React, { useEffect, useState } from "react";
import useDebouncing from "../CustomHooks/useDebouncing";
import { useSelector } from "react-redux";
import { getTrendingPlaces } from "../Features/TravelLogFeature";

const REVERSE_GEOCODING_URL = `https://nominatim.openstreetmap.org`;
// reverse?format=json&lat=${lat}&lon=${lon}

const TrendingPlace = () => {
  const debouncing = useDebouncing(getTrendingPlaces);
  const [location, setLocation] = useState();

  const { trendingPlaces, isLoading } = useSelector((state) => state.travelLog);

  const reverGeoCoding = (lat, lng) => {
    fetch(`${REVERSE_GEOCODING_URL}/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        let datas = data.display_name;
        let output = datas.split(",");
        setLocation(output[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (trendingPlaces.length > 0) {
      const [lat, lng] = trendingPlaces[0]?.location.coordinates;
      reverGeoCoding(lat, lng);
    }
  }, [trendingPlaces]);

  useEffect(() => {
    debouncing();
  }, [debouncing]);

  return (
    <div>
      <div className="border-b-2">
        <h3>Trending Places</h3>
        {isLoading ? <p>Loading...</p> : null}
      </div>

      <article>
        {trendingPlaces?.map((place) => {
          return (
            <div className=" p-1 mb-2 capitalize" key={place._id}>
              <div className="flex p-1 flex-col items-start bg-white shadow-2xl gap-2 rounded-lg text-xs">
                <h2>{place.title}</h2>
                {/* <p>{place.location}📍</p> */}
                <p> LikesCount: {place.likesCount} </p>
                {location && <p>Posted: {location}</p>}
              </div>
            </div>
          );
        })}
      </article>
    </div>
  );
};

export default TrendingPlace;
