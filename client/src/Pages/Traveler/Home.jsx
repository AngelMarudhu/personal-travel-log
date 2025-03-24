import React, { useEffect, lazy, Suspense, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { FaUser } from "react-icons/fa";
import { logOut } from "../../Redux/AuthSlice";
import SearchLog from "./SearchLog";
import { motion } from "framer-motion";
import { IoIosTrendingDown } from "react-icons/io";
import { FaCirclePlus, FaSearchengin } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

const Feed = lazy(() => import("../../Components/Feed"));
const CreateLog = lazy(() => import("../../Components/CreateLog"));
const TrendingPlace = lazy(() => import("../../Components/TrendingPlace"));

const Home = () => {
  const [hoverMenu, setHoverMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hoverRef = useRef(null);
  const [toggleCreation, setToggleCreation] = useState(false);
  const [toggleSearchLog, setToggleSearchLog] = useState(false);
  const [toggleTrending, setToggleTrending] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const handleClick = () => {
    dispatch(logOut());
  };

  useEffect(() => {
    const handleResize = () => {
      setMobileMenu(window.innerWidth <= 768);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleProfile = () => {
    navigate("/user-profile");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (hoverRef.current && !hoverRef.current.contains(event.target)) {
        setHoverMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className=" fixed top-0 bg-white w-full z-10">
        <header className="flex justify-between items-center p-4">
          {!mobileMenu && <h1>Welcome, {user.role}!</h1>}
          {(!mobileMenu || toggleSearchLog) && (
            <div className="flex items-center gap-2">
              <SearchLog mobileMenu={mobileMenu} />
              {toggleSearchLog && (
                <RxCross2
                  onClick={() => setToggleSearchLog(false)}
                  className="text-2xl"
                  cursor={"pointer"}
                />
              )}
            </div>
          )}

          {(!mobileMenu || !toggleSearchLog) && (
            <div
              style={{
                width: `${mobileMenu ? "100%" : "auto"}`,
                display: `${mobileMenu ? "flex" : "block"}`,
                alignItems: "center",
                justifyContent: "space-between",
                border: `${mobileMenu ? "1px solid #ccc" : "none"}`,
                borderRadius: "20px",
                paddingRight: "0.5rem",
                paddingLeft: "0.5rem",
                gap: "1rem",
                height: "40px",
              }}
            >
              <div
                ref={hoverRef}
                onMouseEnter={() => setHoverMenu(true)}
                style={{ border: `${mobileMenu ? "none" : "1px solid #ccc"}` }}
                className="flex items-center border-2 rounded-full p-2 relative"
              >
                <FaUser />
                <span>{`${hoverMenu ? "⬆️" : "🔽"}`}</span>

                {hoverMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="absolute border-2 top-12 right-0 bg-white shadow-lg rounded-lg p-2"
                    style={{
                      transform: "translateZ(0)",
                      width: "100px",
                      minHeight: "80px",
                    }}
                  >
                    <button
                      className=" cursor-pointer border-b-2 "
                      onClick={handleProfile}
                    >
                      Profile
                    </button>
                    <button className="cursor-pointer" onClick={handleClick}>
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>

              <div>
                {mobileMenu && (
                  <div className="flex justify-center gap-20 text-xl">
                    <IoIosTrendingDown
                      onClick={() => setToggleTrending(!toggleTrending)}
                      className="cursor-pointer"
                    />
                    <FaCirclePlus
                      onClick={() => setToggleCreation(!toggleCreation)}
                      className="cursor-pointer"
                    />
                    <FaSearchengin
                      onClick={() => setToggleSearchLog(!toggleSearchLog)}
                      className="cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </header>
      </div>
      <main className="grid grid-cols-1 gap-6 md:grid-cols-4 mt-6 p-4 pt-16">
        {(!mobileMenu || toggleCreation) && (
          <div className="bg-white p-4 shadow-lg rounded-lg">
            <CreateLog />
          </div>
        )}

        <div className="md:col-span-2 bg-white p-4 shadow-lg rounded-lg">
          <Suspense fallback={<div>Loading...</div>}>
            <Feed userId={user.id} />
          </Suspense>
        </div>

        {(!mobileMenu || toggleTrending) && (
          <div className="bg-white p-4 shadow-lg rounded-lg min-h-[200px]">
            <Suspense fallback={<div>Loading...</div>}>
              <TrendingPlace />
            </Suspense>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
