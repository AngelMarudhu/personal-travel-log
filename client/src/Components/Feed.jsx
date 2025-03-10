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
import _ from "lodash";
import useSocket from "../Utils/Socket";

// import Comment from "./Comment";

const Comment = lazy(() => import("./Comment"));

const Feed = ({ userId }) => {
  const [feedMenu, setFeedMenu] = useState(null);
  const [likes, setLikes] = useState(new Map());
  const [toggleDescription, setToggleDescription] = useState(false);
  const [commentPreview, setCommentPreview] = useState(null);
  const debounce = useDebouncing(getTravelLogs);
  const dispatch = useDispatch();

  const { travelLogs, currentPage, totalPages, isLoading } = useSelector(
    (state) => state.travelLog
  );

  const { likeTravelLog } = useSocket();
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
      const currentLikes = newLikes.get(log._id) || log.likes.length;

      if (newLikes.has(log._id)) {
        newLikes.set(log._id, currentLikes - 1);
        newLikes.delete(log._id);
      } else {
        newLikes.set(log._id, currentLikes + 1);
      }

      return newLikes;
    });

    likeTravelLog({ logId: log._id, userId });
  };

  return (
    <div className="w-full p-6 ">
      {travelLogs?.length === 0 && (
        <div>
          <h1 className="text-center">Sorry We Aren't Ready</h1>
        </div>
      )}
      <div className="w-full">
        {travelLogs?.map((log) => {
          const isLogDescription = log.description.length > 20;
          return (
            <article
              key={log._id}
              className="bg-white mb-2 rounded-2xl overflow-hidden border border-pink-200 relative"
            >
              <header className="p-4 bg-gray-100 flex justify-between items-center border-b-1 mb-1">
                <div className="flex flex-col items-start space-x-4">
                  <h2 className="capitalize ">Posted: {log.user?.name}</h2>
                  <div className="flex flex-col items-start space-x-2 capitalize">
                    <h2 className="text-lg font-semibold text-gray-800 capitalize">
                      {log.title}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <h2>From: {log.fromLocation}</h2>
                      <h2>To: {log.toLocation}📍</h2>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleMenuPopUp(log._id)}
                  className="cursor-pointer"
                >
                  <CiMenuKebab />
                </button>
              </header>
              {/* ✅ Proper Swiper Implementation ✅ */}
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
                        className="w-full h-64 object-cover bg-amber-200"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
              <section className="p-4">
                <p className="text-gray-600 text-sm capitalize">
                  Places Visit: {log.placesToVisit?.join(",⚓")}
                </p>
                <br />
                <p className="text-gray-600 capitalize">
                  {toggleDescription || !isLogDescription
                    ? `${log.description}`
                    : `${log.description.slice(0, 20)}...`}

                  {isLogDescription && (
                    <button
                      onClick={() => {
                        setToggleDescription(!toggleDescription);
                      }}
                      className="text-sm ml-2 border-1 border-gray-200 p-1 rounded-lg text-black cursor-pointer"
                    >
                      {toggleDescription ? "ReadLess" : "ReadMore"}
                    </button>
                  )}
                </p>
              </section>
              <footer className="p-4 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
                <button
                  onClick={() => handleLike(log)}
                  className="p-2 rounded-lg bg-blue-500 text-white cursor-pointer"
                >
                  Like❤️
                  <span className="text-gray-800 font-semibold ml-3">
                    {likes.get(log._id) || log.likes.length}
                  </span>
                </button>
                <button
                  className="p-2 border-2 rounded-2xl cursor-pointer"
                  onClick={() => handleCommentPreview(log._id)}
                >
                  Comment
                </button>
                {/* <time dateTime={log.date}>
                  {new Date(log.date).toLocaleDateString()}
                  </time> */}
                <span className="text-sm">Cost: {log.cost} ₹</span>
              </footer>
              {feedMenu === log._id && <FeedMenu />}
              {commentPreview === log._id && (
                <Suspense fallback={<div>Loading...</div>}>
                  <Comment
                    log={log}
                    onClosePreview={setCommentPreview}
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
          className={`w-full p-3 border-2 cursor-pointer rounded-2xl ${
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
