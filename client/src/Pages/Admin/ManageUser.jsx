import React, { useEffect, useState } from "react";
import {
  blockUserFeature,
  deleteUserData,
  getAllUserDetails,
  unBlockUserFeature,
} from "../../Features/Admin/AdminFeature";
import { useDispatch, useSelector } from "react-redux";
import useDebouncing from "../../CustomHooks/useDebouncing";
import { MdDelete, MdBlock } from "react-icons/md";
import { CgUnblock } from "react-icons/cg";

import { VscPreview } from "react-icons/vsc";
import { ToastContainer, toast } from "react-toastify";

const ManageUser = () => {
  const dispatch = useDispatch();
  const [preview, Setpreview] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  // console.log(userDetails);

  const { users, deleted, blocked, unblocked, searchUsersName } = useSelector(
    (state) => state.admin
  );
  const debounce = useDebouncing(getAllUserDetails);

  // console.log(blocked);
  // console.log(unblocked);

  // console.log(searchUsersName.searchUserId);

  useEffect(() => {
    debounce();
  }, [debounce]);

  useEffect(() => {
    if (deleted.isDeleted) {
      toast.success(`${deleted.message} name: ${deleted.nameOfDeletedUser}`, {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
      });
    }
  }, [deleted.isDeleted]);

  useEffect(() => {
    if (blocked.isBlocked) {
      toast.success(blocked.message, {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
      });
      debounce();
    }
    if (unblocked.isUnblocked) {
      toast.success(unblocked.message, {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: false,
      });
      debounce();
    }
  }, [blocked.isBlocked, unblocked.isUnblocked]);

  const handlePreview = (user) => {
    // console.log(user);
    users.forEach((sameUser) => {
      if (user._id === sameUser._id) {
        setUserDetails(sameUser);
        Setpreview(!preview);
        return;
      }
    });
  };

  const handleDelete = (user) => {
    if (window.confirm("Delete the user")) {
      dispatch(deleteUserData(user._id));
    }
  };

  const handleBlock = (user) => {
    // console.log(user);
    if (window.confirm("block the user")) {
      dispatch(blockUserFeature(user._id));
    }
  };

  const handleUnBlock = (user) => {
    if (window.confirm("ublock the user")) {
      dispatch(unBlockUserFeature(user._id));
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="flex flex-col items-start gap-2 overflow-y-scroll h-[600px] scrollbar-hide">
        {users.map((user) => {
          return (
            <div key={user._id} className="w-full">
              <div className="p-2 mb-2 border-2 w-full flex rounded-lg justify-between items-center">
                <div>
                  <h1
                    className="capitalize"
                    style={{
                      backgroundColor:
                        searchUsersName?.searchUserId === user._id ? "red" : "",
                    }}
                  >
                    Name: {user.name}
                  </h1>
                  <h1>
                    Role:{" "}
                    <span className="text-cyan-500 capitalize">
                      {user.role}
                    </span>
                  </h1>
                </div>

                <div className="flex gap-2 text-2xl">
                  <VscPreview
                    onClick={() => handlePreview(user)}
                    fill="blue"
                    opacity={0.5}
                    cursor={"pointer"}
                  />
                  {user.isBlocked ? (
                    <CgUnblock
                      onClick={() => handleUnBlock(user)}
                      fill="green"
                      opacity={1}
                      cursor={"pointer"}
                    />
                  ) : (
                    <MdBlock
                      onClick={() => handleBlock(user)}
                      fill="green"
                      opacity={0.5}
                      cursor={"pointer"}
                    />
                  )}
                  <MdDelete
                    onClick={() => handleDelete(user)}
                    fill="red"
                    opacity={0.5}
                    cursor={"pointer"}
                  />
                </div>
              </div>
              {preview && user._id === userDetails._id && (
                <div className="flex flex-col gap-2 ml-3 shadow-2xl rounded-2xl capitalize bg-cyan-200 p-3">
                  <h1>Name: {userDetails.name}</h1>
                  <h1>Email: {userDetails.email}</h1>
                  <h1>Role: {userDetails.role}</h1>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManageUser;
