import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showEditLog, setUpdateLog } from "../Redux/UserLogSlice";
import ConfirmDelete from "./ConfirmDelete";
import { removeLocalYourLogs } from "../Redux/UserLogSlice";
import { deleteTravelLog } from "../Features/UserLogFeature";
import { postSavedLog } from "../Features/SavedLogFeature";

const FeedMenu = ({
  userMenu,
  logs,
  closeMenu,
  feedLogForSave,
  toggleReportForm,
  toggleWeatherDetails,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.savedLog);

  const handleEditLog = () => {
    dispatch(showEditLog());
    dispatch(setUpdateLog(logs));
    closeMenu();
  };

  const handleDelete = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteTravelLog(logs._id));
    setConfirmOpen(false);
    dispatch(removeLocalYourLogs(logs._id));
    closeMenu();
  };

  const handlePostSavedLog = () => {
    dispatch(postSavedLog(feedLogForSave._id));
  };

  const handleToggleReport = () => {
    toggleReportForm(feedLogForSave._id);
  };

  return (
    <div>
      <div className="absolute top-0 right-10 bg-white shadow-lg rounded-lg p-4 z-50">
        <ul className="space-y-5">
          <li className="text-gray-600 hover:border-b-1 hover:border-gray-400 transition-all duration-300">
            {userMenu ? (
              <button onClick={handleEditLog}>Edit</button>
            ) : (
              // <button className="cursor-not-allowed text-gray-400">
              //   Follow *
              // </button>
              <></>
            )}
          </li>
          <li className="text-gray-600 hover:border-b-1 hover:border-gray-400 transition-all duration-300">
            {userMenu ? (
              <button onClick={handleDelete}>Delete</button>
            ) : (
              <button onClick={handlePostSavedLog}>
                {isLoading ? "Saving..." : "Save"}
              </button>
            )}
          </li>
          <li className="text-gray-600 hover:border-b-1 hover:border-gray-400 transition-all duration-300">
            {userMenu ? (
              <button>Share</button>
            ) : (
              <button onClick={() => toggleWeatherDetails(feedLogForSave._id)}>
                Weather
              </button>
            )}
          </li>
          <li className="text-gray-600 hover:border-b-1 hover:border-gray-400 transition-all duration-300">
            {userMenu ? (
              ""
            ) : (
              <button onClick={handleToggleReport}>Report</button>
            )}
          </li>
        </ul>
      </div>

      <ConfirmDelete
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          closeMenu();
        }}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this log?"
      />
    </div>
  );
};

export default FeedMenu;
