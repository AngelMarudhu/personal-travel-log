import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { yourSearchLocationQuery } from "../../Redux/SearchLogSlice";
import { filterUserLog } from "../../Redux/UserLogSlice";
import { setCoordinates } from "../../Redux/SearchLogSlice";

const SearchLog = ({ userLog, mobileMenu }) => {
  const [searchLocation, setSearchLocation] = useState({
    fromLocation: "",
    toLocation: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (
      searchLocation.fromLocation.trim() === "" ||
      searchLocation.toLocation.trim() === ""
    ) {
      toast.error("Please enter a location", {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      return;
    }

    if (
      searchLocation.fromLocation.trim() !== "" &&
      searchLocation.toLocation.trim() !== "" &&
      !userLog
    ) {
      dispatch(
        yourSearchLocationQuery({
          fromLocation: searchLocation.fromLocation,
          toLocation: searchLocation.toLocation,
        })
      );
      navigate("/search-results");
      // window.location.href = "/search-results";
    } else {
      dispatch(filterUserLog(searchLocation));
    }
    // console.log(searchLocation);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchLocation((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleNearby = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // console.log({ latitude, longitude });
          dispatch(setCoordinates({ latitude, longitude }));
          navigate("/search-results");
        },
        (error) => {
          alert("Failed to get your location please allow location access");
        }
      );
    } else {
      alert("GeoLocation is not supported");
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className=" flex items-center border-2 border-black p-2 rounded-2xl">
        <input
          className=" w-auto border-r-2 focus:border-r-2 outline-none mr-3"
          type="text"
          placeholder="From Location"
          name="fromLocation"
          value={searchLocation.fromLocation}
          onChange={(e) => handleChange(e)}
        />
        <input
          className=" w-auto border-r-2 focus:border-r-2 outline-none mr-3"
          type="text"
          name="toLocation"
          placeholder="To Location"
          value={searchLocation.toLocation}
          onChange={(e) => handleChange(e)}
        />
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="cursor-pointer pr-3 border-r-2"
          >
            Search
          </button>

          <button
            className="cursor-pointer text-cyan-900"
            onClick={(e) => handleNearby(e)}
          >
            NearBy Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchLog;
