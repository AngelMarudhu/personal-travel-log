import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  searchByBuget,
  searchByDate,
  clearSearchLogs,
  sortMostLikes,
} from "../../Redux/SearchLogSlice";
import useDebouncing from "../../CustomHooks/useDebouncing";
import { searchLogByLocation } from "../../Features/TravelLogFeature";
import _, { set } from "lodash";

const SearchFilters = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const [budget, setBudget] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const debounce = useDebouncing(searchLogByLocation);

  const { filteredSearchLogs } = useSelector(
    (state) => state.searchLogByLocation
  );

  // console.log(filteredSearchLogs);

  const handleCloseSearch = () => {
    navigate("/home");
    sessionStorage.removeItem("yourSearchLocation");
  };

  const handleApplyFilters = () => {};

  const handleCloseFilters = () => {
    setShowFilters(false);
    dispatch(clearSearchLogs());
    setSearchDate("");
  };

  const debouncedSearchDate = useCallback(
    _.debounce((date) => {
      dispatch(searchByDate(date));
    }, 1000),
    [dispatch]
  );

  const debouncedSearchBudget = useCallback(
    _.debounce((budget) => {
      dispatch(searchByBuget(budget));
    }, 1000),
    [dispatch, budget]
  );

  useEffect(() => {
    if (searchDate) {
      debouncedSearchDate(searchDate);
    }
    if (budget) {
      debouncedSearchBudget(budget);
    } else {
      dispatch(searchByBuget(null));
    }
    return () => {
      if (debouncedSearchDate) {
        debouncedSearchDate.cancel();
      }
      if (debouncedSearchBudget) {
        debouncedSearchBudget.cancel();
      }
    };
  }, [searchDate, debouncedSearchDate, budget, dispatch]);

  return (
    <div className="p-5 pb-2">
      <div className="flex justify-between items-center">
        <div className="">
          {showFilters ? (
            <button
              onClick={handleCloseFilters}
              className="p-2 border border-gray-400 rounded-lg cursor-pointer"
            >
              Close Filters
            </button>
          ) : (
            <button
              onClick={() => setShowFilters(true)}
              className="p-2 border border-gray-400 rounded-lg cursor-pointer"
            >
              Your Filters
            </button>
          )}
        </div>

        {!showFilters && (
          <button
            onClick={handleCloseSearch}
            className="p-2 border border-gray-400 rounded-lg cursor-pointer"
          >
            Close Search
          </button>
        )}

        {showFilters && (
          <div className="flex gap-5">
            <input
              className="w-auto p-2 border border-gray-400 rounded-lg cursor-pointer"
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              placeholder="Search By Date"
            />
            <input
              className="w-auto p-2 border border-gray-400 rounded-lg cursor-text"
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Search by Budget"
            />
            <button
              onClick={() => dispatch(sortMostLikes())}
              className="p-2 border border-gray-400 rounded-lg cursor-pointer"
            >
              Sory By Most Likes
            </button>
            <button
              onClick={handleApplyFilters}
              className="p-2 border border-gray-400 rounded-lg cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>
      {showFilters && (
        <div className="mt-2">
          {filteredSearchLogs.length === 0
            ? "Your Filtered Logs is Empty Apply Filters "
            : `${filteredSearchLogs.length} Filter Logs Found Here The Logs`}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
