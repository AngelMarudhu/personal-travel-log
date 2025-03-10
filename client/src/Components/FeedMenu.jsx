import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showEditLog, setUpdateLog } from "../Redux/UserLogSlice";
import ConfirmDelete from "./ConfirmDelete";
import { removeLocalYourLogs } from "../Redux/UserLogSlice";
import { deleteTravelLog, getUserTravelLogs } from "../Features/UserLogFeature";

const FeedMenu = ({ userMenu, logs, closeMenu }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const dispatch = useDispatch();

  // console.log(logs);

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

  // console.log(userMenu);
  return (
    <div>
      <div className="absolute top-0 right-10 bg-white shadow-lg rounded-lg p-4 z-50">
        <ul className="space-y-5">
          <li className="text-gray-600 hover:border-b-1 hover:border-gray-400 transition-all duration-300">
            {userMenu ? (
              <button onClick={handleEditLog}>Edit</button>
            ) : (
              <button>Follow</button>
            )}
          </li>
          <li className="text-gray-600 hover:border-b-1 hover:border-gray-400 transition-all duration-300">
            {userMenu ? (
              <button onClick={handleDelete}>Delete</button>
            ) : (
              <button> Save</button>
            )}
          </li>
          <li className="text-gray-600 hover:border-b-1 hover:border-gray-400 transition-all duration-300">
            {userMenu ? (
              <button>Share</button>
            ) : (
              <button> Not Interested</button>
            )}
          </li>
          <li className="text-gray-600 hover:border-b-1 hover:border-gray-400 transition-all duration-300">
            {userMenu ? "" : <button>Report</button>}
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
