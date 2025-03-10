import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../../Features/UserManagementFeature";
import {
  hideEditOptionPanel,
  showActivePanel,
  resetPreviosSession,
} from "../../../Redux/Traveler/userInfoSlice";

const ChangePassword = () => {
  const [password, setpassword] = useState("");
  const dispatch = useDispatch();
  const { isLoading, isPasswordChanged, error } = useSelector(
    (state) => state.userInfo
  );

  useEffect(() => {
    if (isPasswordChanged) {
      dispatch(hideEditOptionPanel());
      dispatch(showActivePanel(null));
      dispatch(resetPreviosSession());
    }
  }, [isPasswordChanged, dispatch]);

  return (
    <div>
      <h1 className="text-center mb-4">
        {error ? error.message : "Change Password"}
      </h1>
      <div>
        <input
          type="text"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          placeholder="Enter New Password"
          className="border-2 w-full border-gray-300 p-2 rounded-lg"
        />
        <button
          onClick={() => dispatch(changePassword({ newPassword: password }))}
          className="text-white p-2 border-2 border-white cursor-pointer rounded-lg mt-3 w-full "
        >
          {isLoading ? "changing..." : "Change Password"}
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
