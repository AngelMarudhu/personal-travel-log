import React, { useEffect } from "react";
import useDebouncing from "../CustomHooks/useDebouncing";
import { useDispatch, useSelector } from "react-redux";
import { getTrendingPlaces } from "../Features/TravelLogFeature";

const TrendingPlace = () => {
  const debouncing = useDebouncing(getTrendingPlaces);

  const { trendingPlaces, isLoading } = useSelector((state) => state.travelLog);

  // console.log(trendingPlaces);

  useEffect(() => {
    debouncing();
  }, [debouncing]);

  return (
    <div>
      <div>
        <h3>Trending Places</h3>
        {isLoading ? <p>Loading...</p> : null}
      </div>

      <article>
        {trendingPlaces.map((place) => {
          return (
            <div className=" p-1 mb-2" key={place._id}>
              <div className="flex p-1 flex-col items-start bg-white shadow-2xl gap-2 rounded-lg text-xs">
                <h2>{place.title}</h2>
                <p>{place.location}📍</p>
                <p> LikesCount: {place.likesCount} </p>
              </div>
            </div>
          );
        })}
      </article>
    </div>
  );
};

export default TrendingPlace;
