import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { sentOTP, verifyOtp } from "../../Features/UserManagementFeature";
import ChangePassword from "./UserManagementComponents/ChangePassword";

const OtpValidation = ({ showPassword, setShowPassword }) => {
  const [yourEmail, setYourEmail] = useState("");
  const [otp, setOtp] = useState("");
  const { userOTP, isLoading, error } = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();
  // console.log(userOTP);
  // console.log(yourEmail);

  useEffect(() => {
    if (userOTP.isSentOtp) {
      toast.success("OTP has been sent to your mail", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
    if (userOTP.isVerifiedOtp) {
      toast.success("OTP has been verified", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  }, [userOTP.isSentOtp, userOTP.isVerifiedOtp]);

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    dispatch(verifyOtp({ otp: otp }));
    setShowPassword(true);
  };

  return (
    <div className="text-white p-5 w-full h-full">
      <ToastContainer />
      <div>
        {showPassword && userOTP.isVerifiedOtp && (
          <div>
            <ChangePassword />
          </div>
        )}
      </div>

      {!userOTP.isSentOtp && !showPassword && (
        <div>
          <div className="text-center capitalize mb-3">
            {error ? error.message : "Enter Your Email"}
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter Current Email"
              value={yourEmail}
              onChange={(e) => setYourEmail(e.target.value)}
              className="border-2 w-full border-gray-300 p-2 rounded-lg"
            />
            <button
              onClick={() => dispatch(sentOTP({ email: yourEmail }))}
              className="text-white p-2 border-2 border-white cursor-pointer rounded-lg mt-3 w-full "
            >
              {isLoading ? "Sending..." : "Sent OTP"}
            </button>
          </div>
        </div>
      )}

      {userOTP.isSentOtp && (
        <div className="mt-6">
          <div className="text-center capitalize mb-3">
            {error ? error.message : "Enter Your OTP"}
          </div>

          <div>
            <input
              type="text"
              placeholder="Enter 6 Digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border-2 w-full border-gray-300 p-2 rounded-lg"
            />
            <button
              onClick={handleVerifyOtp}
              className="text-white p-2 border-2 border-white cursor-pointer rounded-lg mt-3 w-full"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtpValidation;
