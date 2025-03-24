import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeEmail } from "../../../Features/UserManagementFeature";
import { resetPreviosSession } from "../../../Redux/Traveler/userInfoSlice";
import { hideEditOptionPanel } from "../../../Redux/Traveler/userInfoSlice";
import { getUserInfo } from "../../../Features/AuthFeatures";

const ChangeEmail = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const { isLoading, error, isEmailChanged } = useSelector(
    (state) => state.userInfo
  );

  useEffect(() => {
    if (isEmailChanged) {
      setEmail("");
      dispatch(hideEditOptionPanel());
      dispatch(resetPreviosSession());
      dispatch(getUserInfo());
    }
  }, [isEmailChanged, dispatch]);

  const handleEmail = () => {
    dispatch(changeEmail({ newEmail: email }));
  };

  return (
    <div className="mb-4">
      <h1 className="text-center mb-4">
        {error ? error.message : "Change Email"}
      </h1>
      <div>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter New Email"
          className="border-2 w-full border-gray-300 p-2 rounded-lg"
        />
        <button
          onClick={handleEmail}
          className="text-white p-2 border-2 border-white cursor-pointer rounded-lg mt-3 w-full "
        >
          {isLoading ? "Changing..." : "Change Email"}
        </button>
      </div>
    </div>
  );
};

export default ChangeEmail;
