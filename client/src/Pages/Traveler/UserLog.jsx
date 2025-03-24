import React, { lazy, Suspense, useEffect, useState } from "react";
import { getUserTravelLogs } from "../../Features/UserLogFeature";
import { useDispatch, useSelector } from "react-redux";
import useDebouncing from "../../CustomHooks/useDebouncing";
import { CiMenuKebab } from "react-icons/ci";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import FeedMenu from "../../Components/FeedMenu";
import { toast, ToastContainer } from "react-toastify";
import SearchLog from "./SearchLog";
import { FaUser, FaEdit } from "react-icons/fa";
import { showEditOptionPanel } from "../../Redux/Traveler/userInfoSlice";

const UpdateLog = lazy(() => import("../../Components/UpdateLog"));
const UserLogUpdateInformation = lazy(() =>
  import("../../Components/TravelerUserLogComponents/UserLogUpdateInformation")
);
const Expenses = lazy(() =>
  import(
    "../../Components/TravelerUserLogComponents/UserManagementComponents/Expenses.jsx"
  )
);

const UserLog = () => {
  const [feedMenu, setFeedMenu] = useState(null);
  const dispatch = useDispatch();
  const debounce = useDebouncing(getUserTravelLogs);
  const [isOpenExpensePopup, setIsExpensePopup] = useState(null);
  const { yourLogs, isEditing } = useSelector((state) => state.userLog);
  const { user } = useSelector((state) => state.auth);
  const { showEditPanel } = useSelector((state) => state.userInfo);

  useEffect(() => {
    debounce();
  }, [debounce]);

  const handleMenuPopUp = (id) => {
    setFeedMenu(feedMenu === id ? null : id);
  };

  // console.log(yourLogs);

  return (
    <div className="p-4">
      <ToastContainer />
      <div className="w-full mb-3">
        <header className="flex justify-between items-center">
          <h2>Welcome traveler!</h2>
          <SearchLog userLog={true} />
          <FaUser className="text-4xl border rounded-full p-1 cursor-pointer" />
        </header>
      </div>
      <main className="flex space-x-6 mt-6 relative">
        <div className="w-1/3 bg-white p-4 shadow-lg rounded-lg capitalize">
          <h2 className="text-2xl font-semibold">User Data</h2>
          <aside className="mt-4 w-full border-2 border-gray-400 rounded-lg p-2">
            <div className="flex justify-between items-center">
              <h2>Name: {user.name}</h2>
              <FaEdit
                cursor={"pointer"}
                onClick={() => dispatch(showEditOptionPanel())}
              />
            </div>
            <h2>Email: {user.email}</h2>
            <h2>Role: {user.role}</h2>
            <h2>IsAlive: {user.isBlocked ? "Dead" : "Alive"}</h2>
          </aside>
          <div className="flex justify-between mt-4 border-2 border-gray-400 rounded-lg p-2">
            <a href="/saved-logs">Your Saved Logs</a>
          </div>
        </div>

        {/* logs */}
        <div className="flex w-1/2 flex-col items-center gap-10 m-auto justify-center bg-white rounded-lg p-4 shadow-lg">
          {yourLogs?.length === 0 && (
            <h1>Go somewhere share your experience!📪</h1>
          )}
          {yourLogs?.map((log) => {
            return (
              <article
                key={log._id}
                className="bg-white mb-2 rounded-2xl overflow-hidden border border-pink-200 relative w-full"
              >
                <header className="p-4 bg-gray-100 flex justify-between items-center border-b-1 mb-1">
                  <div className="flex flex-col min-w-full items-start space-x-4">
                    <div className="flex flex-row items-center justify-between w-full">
                      <div>
                        <h2 className="capitalize text-[16px]">
                          Title: {log.title}
                        </h2>
                        <time className="text-[12px]" dateTime={log.date}>
                          {`${new Date(log.date).toDateString()} at ${new Date(
                            log.date
                          ).toLocaleTimeString("en-US", {
                            timeStyle: "short",
                          })}`}
                        </time>
                      </div>
                      <button
                        onClick={() => handleMenuPopUp(log._id)}
                        className="cursor-pointer"
                      >
                        <CiMenuKebab />
                      </button>
                    </div>
                  </div>
                </header>
                {/* Proper Swiper Implementation */}
                {log.images?.length > 0 && (
                  <Swiper
                    modules={[Pagination, Navigation]}
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                    navigation
                    spaceBetween={20}
                    slidesPerView={1}
                    className="w-full h-64"
                  >
                    {log.images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={image}
                          alt={`${log.title} - Image ${index + 1}`}
                          className="w-full h-70 object-cover bg-amber-200"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
                <section className="p-4">
                  <p className="text-gray-600 capitalize">{log.description}</p>
                </section>
                <footer className="p-4 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
                  <button className="p-2 border-1 rounded-2xl">
                    Likes❤️
                    <span className="text-gray-800 font-semibold ml-3">
                      {log.likes.length}
                    </span>
                  </button>

                  <button
                    className="p-2 border-1 rounded-2xl cursor-pointer"
                    onClick={() => {
                      setIsExpensePopup(
                        isOpenExpensePopup === log._id ? null : log._id
                      );
                    }}
                  >
                    Add Expenses
                  </button>
                </footer>
                {feedMenu === log._id && (
                  <FeedMenu
                    userMenu={true}
                    logs={log}
                    closeMenu={() => {
                      setFeedMenu(null);
                    }}
                  />
                )}

                {isOpenExpensePopup === log._id && (
                  <div>
                    <Suspense fallback={<div>Loading...</div>}>
                      <Expenses
                        logs={log}
                        closeExpensePopup={() => setIsExpensePopup(null)}
                      />
                    </Suspense>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {showEditPanel && (
          <div className="fixed inset-0 z-50 opacity-96 bg-black w-full h-full m-auto border-2 rounded-lg">
            <UserLogUpdateInformation />
          </div>
        )}
      </main>
      {isEditing && (
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <UpdateLog />
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default UserLog;
