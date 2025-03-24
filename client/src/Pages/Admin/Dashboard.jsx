import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../Redux/AuthSlice";
import { setSearchUserName } from "../../Redux/Admin/AdminSlice";
import { IoMdNotifications, IoIosNotificationsOutline } from "react-icons/io";
import useSocket from "../../Utils/Socket";

const ManageUser = lazy(() => import("./ManageUser"));
const NotificationList = lazy(() =>
  import("../../Components/AdminLogComponents/NotificationList")
);
const AdminSearchUsers = lazy(() => import("./AdminSearchUsers"));

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const hideUserPanel = useRef(null);
  const [focus, setFocus] = useState(false);
  const [selectedUserFromSearch, setSelectedUserFromSearch] = useState(null);
  const dispatch = useDispatch();
  const [toggleNotificationList, setToggleNotificationList] = useState(false);

  const { notification } = useSocket();

  useEffect(() => {
    if (selectedUserFromSearch) {
      dispatch(setSearchUserName(selectedUserFromSearch));
    }
  }, [selectedUserFromSearch]);

  const handleClick = () => {
    dispatch(logOut());
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        hideUserPanel.current &&
        !hideUserPanel.current.contains(event.target)
      ) {
        setFocus(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onmousedown]);

  const { users, adminDetails } = useSelector((state) => state.admin);

  return (
    <div className="w-full h-screen bg-white overflow-hidden">
      <header className="flex bg-cyan-200 mb-3 shadow-2xl justify-between items-center p-4 relative">
        <h1>Welcome, Admin!</h1>

        <div className="relative rounded-lg p-2">
          <input
            className=" w-auto border-2 p-2 rounded-lg focus:border-r-2 border-l-2 outline-none"
            type="text"
            onFocus={(e) => setFocus(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search By Name"
          />
          {focus && searchQuery.trim() !== "" && (
            <div
              ref={hideUserPanel}
              className="absolute top-13 left-2 w-100 h-auto z-100 bg-white p-2 rounded-lg shadow-lg"
            >
              <AdminSearchUsers
                users={users}
                closeFocus={setFocus}
                searchQuery={searchQuery}
                selectedUserFromSearch={selectedUserFromSearch}
                setSelectedUserFromSearch={setSelectedUserFromSearch}
              />
            </div>
          )}
        </div>
        <div
          className="flex items-center border-2 p-2 rounded-lg cursor-pointer"
          onClick={() => setToggleNotificationList(!toggleNotificationList)}
        >
          Spam User
          {notification.length > 0 ? (
            <div className="flex items-center gap-2">
              <IoMdNotifications className="text-2xl" />
              <span>{notification?.length}</span>
            </div>
          ) : (
            <IoIosNotificationsOutline className="text-2xl" />
          )}
        </div>

        <button className="cursor-pointer" onClick={handleClick}>
          Logout
        </button>

        {toggleNotificationList && (
          <div className="absolute top-20 z-100 right-55 w-2/5 h-auto bg-white p-4 rounded-lg shadow-lg">
            <Suspense fallback={<div>Loading...</div>}>
              <NotificationList
                notifications={notification}
                onCloseNotificationList={setToggleNotificationList}
              />
            </Suspense>
          </div>
        )}
      </header>
      <div className="w-full relative flex gap-4 p-4">
        <div className="w-1/3 bg-white p-4 shadow-lg rounded-lg">
          <Suspense fallback={<div>Loading...</div>}>
            <ManageUser />
          </Suspense>
        </div>
        <div className="w-2/4 h-80 grid grid-cols-3 gap-3 absolute top-4 right-4">
          <div className="border-1 rounded-lg shadow-2xl flex justify-center items-center flex-col">
            <h2 className="text-2xl font-bold">Total Users</h2>
            <h1 className="text-4xl font-semibold">
              {adminDetails.totalUsers || users.length}
            </h1>
          </div>
          <div className="border-1 rounded-lg shadow-2xl flex justify-center items-center flex-col">
            <h2 className="text-2xl font-bold">Total Likes</h2>
            <h1 className="text-4xl font-semibold">
              {adminDetails.totalLikes}
            </h1>
          </div>
          <div className="border-1 rounded-lg shadow-2xl flex justify-center items-center flex-col">
            <h2 className="text-2xl font-bold">Total Logs</h2>
            <h1 className="text-4xl font-semibold">{adminDetails.totalLogs}</h1>
          </div>
          <div className="border-1 rounded-lg shadow-2xl flex justify-center items-center flex-col">
            <h2 className="text-2xl font-bold">Comments</h2>
            <h1 className="text-4xl font-semibold">
              {adminDetails.totalComments}
            </h1>
          </div>
          <div className="border-1 rounded-lg shadow-2xl flex justify-center items-center flex-col">
            <h2 className="text-2xl font-bold">Trending</h2>
            <h1 className="text-4xl font-semibold">5</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
