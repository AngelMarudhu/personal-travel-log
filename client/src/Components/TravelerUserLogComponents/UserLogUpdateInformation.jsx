import React, { lazy, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { showActivePanel } from "../../Redux/Traveler/userInfoSlice";
import { useDispatch, useSelector } from "react-redux";
import { hideEditOptionPanel } from "../../Redux/Traveler/userInfoSlice";

const ChangeEmail = lazy(() =>
  import("./UserManagementComponents/ChangeEmail")
);
const ChangePassword = lazy(() =>
  import("./UserManagementComponents/ChangePassword")
);
const OtpValidation = lazy(() => import("./OtpValidation"));

const UserLogUpdateInformation = () => {
  const [showPassword, setShowPassword] = useState(false);

  const panels = {
    changeEmail: (
      <div>
        <ChangeEmail />
      </div>
    ),
    changePassword: (
      <div>
        <ChangePassword />
      </div>
    ),
    otpValidation: (
      <div>
        <OtpValidation
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
      </div>
    ),
  };

  const dispatch = useDispatch();
  const { activePanel } = useSelector((state) => state.userInfo);

  // console.log(activePanel);

  const handleClosePanel = () => {
    dispatch(hideEditOptionPanel());
    dispatch(showActivePanel(null));
  };

  const handleChangePassword = () => {
    dispatch(showActivePanel("otpValidation"));
  };

  return (
    <div className="text-white p-5 w-full h-full">
      <div className="flex justify-between items-center">
        <h2>Manipulate Your Data</h2>
        <FaWindowClose
          onClick={handleClosePanel}
          cursor={"pointer"}
          className="text-2xl"
        />
      </div>

      <div className="flex flex-col justify-center items-center h-full">
        <h2 className="w-100 text-left mb-4 text-red-400">
          If your email isn’t genuine, update it first before changing your
          password. Stay cautious while updating your password!
        </h2>
        {/* For Panels */}

        <div className="flex justify-center items-center">
          <div>{panels[activePanel]}</div>
        </div>

        <div className="flex justify-evenly items-center w-full">
          <button
            onClick={() => dispatch(showActivePanel("changeEmail"))}
            className="p-2 border border-white rounded-lg cursor-pointer"
          >
            Change Email
          </button>
          <button
            onClick={handleChangePassword}
            className="p-2 border border-white rounded-lg cursor-pointer disabled:cursor-not-allowed"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserLogUpdateInformation;
