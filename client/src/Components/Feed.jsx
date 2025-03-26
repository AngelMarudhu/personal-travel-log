import React, { lazy, useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTravelLogs } from "../Features/TravelLogFeature";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { CiMenuKebab } from "react-icons/ci";
import FeedMenu from "./FeedMenu";
import useDebouncing from "../CustomHooks/useDebouncing";
import _, { last } from "lodash";
import useSocket from "../Utils/Socket";
import { resetSavedLog } from "../Redux/Traveler/SavedLogSlice.jsx";

const Comment = lazy(() => import("./Comment"));
const ReportForm = lazy(() => import("./TravelerUserLogComponents/ReportForm"));
const ShowExpenses = lazy(() =>
  import("./TravelerUserLogComponents/ShowExpenses.jsx")
);

const Feed = ({ userId }) => {
  const [feedMenu, setFeedMenu] = useState(null);
  const [likes, setLikes] = useState(new Map());
  const [toggleDescription, setToggleDescription] = useState(false);
  const [commentPreview, setCommentPreview] = useState(null);
  const debounce = useDebouncing(getTravelLogs);
  const dispatch = useDispatch();
  const [toggleReportForm, setToggleReportForm] = useState(null);
  const [showExpenses, setShowExpenses] = useState(null);

  const { travelLogs, currentPage, totalPages, isLoading } = useSelector(
    (state) => state.travelLog,
    _.isEqual
  );
  //// _.isEqual is used to compare the old and new state if there is no change in the state then it will not re-render the component

  const { isSaved, error } = useSelector((state) => state.savedLog);

  // console.log(error);
  const { likeTravelLog, socketError } = useSocket();

  useEffect(() => {
    if (error) {
      window.alert("already saved");
      dispatch(resetSavedLog());
    }
    if (isSaved) {
      window.alert("saved successfully");
      dispatch(resetSavedLog());
    }
    if (socketError) {
      window.alert(socketError);
    }
  }, [error, isSaved, socketError]);

  const handleLoadMore = () => {
    if (currentPage <= totalPages) {
      debounce({ page: currentPage + 1 });
    }
  };

  useEffect(() => {
    debounce({ page: 1 });
  }, [debounce]);

  const handleMenuPopUp = (id) => {
    setFeedMenu(feedMenu === id ? null : id);
  };

  const handleCommentPreview = (id) => {
    // console.log(id);
    setCommentPreview(commentPreview === id ? null : id);
  };

  const handleLike = (log) => {
    setLikes((prev) => {
      const newLikes = new Map(prev);
      const currentLikes = newLikes.get(log._id) ?? log.likes.length;

      if (newLikes.has(log._id)) {
        newLikes.delete(log._id);
      } else {
        newLikes.set(log._id, currentLikes + 1);
      }

      return newLikes;
    });

    likeTravelLog({ logId: log._id, userId });
  };

  return (
    <div className="w-full p-4">
      {travelLogs?.length === 0 && (
        <div>
          <h1 className="text-center">Sorry We Aren't Ready</h1>
        </div>
      )}
      <div className="w-full ">
        {travelLogs?.map((log) => {
          const isLogDescription = log.description.length > 20;
          return (
            <article
              key={log._id}
              className="bg-white mb-2 rounded-2xl overflow-hidden border border-pink-200 relative"
            >
              <header className="p-4 pb-0 bg-gray-100 w-full items-center border-b-1 mb-1">
                <div className="flex flex-col min-w-full items-start space-x-4">
                  <div className="flex flex-row items-center justify-between w-full">
                    <div>
                      <h2 className="capitalize text-[16px]">
                        Traveler: {log.user?.name}
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
                <div className="flex text-sm items-center mt-3 justify-center capitalize">
                  <div className="flex items-center gap-2">
                    <h2 className="font-medium">From:</h2>
                    <span className="text-gray-700">
                      {log.fromLocation?.split(",")[0]}
                    </span>
                  </div>

                  <div className="text-gray-400 ml-1 mr-1">→</div>

                  <div className="flex items-center gap-2">
                    <h2 className="font-medium">To:</h2>
                    <span className="text-gray-700">
                      {log.toLocation?.split(",")[0]}
                    </span>
                  </div>
                </div>
                <h2 className="text-lg font-bold text-center text-gray-800 capitalize">
                  {log.title}
                </h2>
              </header>

              {log.images?.length > 0 && (
                <Swiper
                  modules={[Pagination, Navigation]}
                  navigation={log.images.length > 1}
                  pagination={{ clickable: true }}
                  scrollbar={{ draggable: true }}
                  spaceBetween={20}
                  slidesPerView={1}
                  className="w-full h-64"
                >
                  {log.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        loading="lazy"
                        src={image}
                        alt={`${log.title} - Image ${index + 1}`}
                        className="w-full h-64 object-cover bg-amber-200"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
              <section className="p-4">
                <p className="text-gray-600 capitalize">
                  {toggleDescription || !isLogDescription
                    ? `${log.description}`
                    : `${log.description.slice(0, 20)}...`}

                  {isLogDescription && (
                    <button
                      onClick={() => {
                        setToggleDescription(!toggleDescription);
                      }}
                      className="text-sm ml-2 rounded-lg text-black cursor-pointer"
                    >
                      {toggleDescription ? "ReadLess" : "ReadMore"}
                    </button>
                  )}
                </p>

                <br />

                <p className="text-gray-600 text-sm capitalize">
                  Places Visit: {log.placesToVisit?.join(" → ")}
                </p>
              </section>
              <footer className="p-4 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
                <button
                  onClick={() => handleLike(log)}
                  className="p-2 rounded-lg text-black cursor-pointer hover:bg-gray-200 hover:border-gray-200 hover:transition-opacity duration-300 ease-in-out "
                >
                  Like❤️
                  <span className="text-gray-800 font-semibold ml-3">
                    {likes.get(log._id) || log.likes.length}
                  </span>
                </button>
                <button
                  className="p-2 hover:bg-gray-200 rounded-lg cursor-pointer hover:transition-opacity duration-300 ease-in-out"
                  onClick={() => {
                    handleCommentPreview(log._id);
                    setShowExpenses(null);
                  }}
                >
                  Comment
                </button>
                <div>
                  <span
                    onClick={() =>
                      setShowExpenses(() => {
                        setShowExpenses(
                          showExpenses === log._id ? null : log._id
                        );
                        setCommentPreview(null);
                      })
                    }
                    className="p-2 hover:bg-gray-200 rounded-lg cursor-pointer hover:transition-opacity duration-300 ease-in-out"
                  >
                    Expenses
                  </span>
                </div>
              </footer>
              {feedMenu === log._id && (
                <FeedMenu
                  feedLogForSave={log}
                  toggleReportForm={setToggleReportForm}
                />
              )}

              {commentPreview === log._id && (
                <Suspense
                  fallback={
                    <div className="animate-pulse bg-gray-300 h-10 w-full"></div>
                  }
                >
                  <Comment
                    log={log}
                    onClosePreview={setCommentPreview}
                    userId={userId}
                  />
                </Suspense>
              )}

              {showExpenses === log._id && (
                <Suspense fallback={<div>Loading...</div>}>
                  <ShowExpenses logs={log} />
                </Suspense>
              )}

              {toggleReportForm === log._id && (
                <Suspense fallback={<div>Loading...</div>}>
                  <ReportForm
                    log={log}
                    toggleReportForm={setToggleReportForm}
                    userId={userId}
                  />
                </Suspense>
              )}
            </article>
          );
        })}
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleLoadMore}
          disabled={currentPage >= totalPages}
          className={`p-1 border-2 cursor-pointer rounded-xl ${
            currentPage >= totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-transparent text-black"
          }`}
        >
          {isLoading ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
};

export default Feed;
