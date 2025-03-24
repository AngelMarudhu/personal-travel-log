import React, { useEffect, useState, useCallback } from "react";
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

const ManageUser = () => {
  const dispatch = useDispatch();
  const [preview, Setpreview] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  const { users, deleted, blocked, unblocked, searchUsersName } = useSelector(
    (state) => state.admin
  );
  const debounce = useDebouncing(getAllUserDetails);

  const handleCallback = useCallback(() => {
    debounce();
  }, [debounce]);

  useEffect(() => {
    handleCallback();
  }, [handleCallback]);

  useEffect(() => {
    if (deleted.isDeleted) {
      window.alert(`${deleted.message} name: ${deleted.nameOfDeletedUser}`);
    }
  }, [deleted.isDeleted]);

  useEffect(() => {
    if (blocked.isBlocked || unblocked.isUnblocked) {
      window.alert(blocked.isBlocked ? blocked.message : unblocked.message);
      debounce();
    }
  }, [blocked.isBlocked, unblocked.isUnblocked, debounce]);

  const handlePreview = (user) => {
    //  first find then set the userDetails
    const foundUser = users.find((u) => u._id === user._id);
    if (foundUser) {
      setUserDetails(foundUser);
      Setpreview(!preview);
    }
  };

  const handleDelete = (user) => {
    if (window.confirm("Delete the user")) {
      dispatch(deleteUserData(user._id));
    }
  };

  const handleBlock = (user) => {
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
      <div className="flex flex-col items-start gap-2 overflow-y-scroll h-[600px] scrollbar-hide">
        {users.map((user) => {
          return (
            <div key={user._id} className="w-full">
              <div className="p-2 mb-2 border-2 w-full flex rounded-lg justify-between items-center">
                <div>
                  <h1
                    style={{
                      backgroundColor:
                        searchUsersName?.searchUserId === user._id ? "red" : "",
                    }}
                  >
                    Name: {user.name}
                  </h1>
                  <h1>
                    Role: <span className="text-cyan-500">{user.role}</span>
                  </h1>
                </div>

                <div className="flex gap-2 text-2xl">
                  <VscPreview
                    onClick={() => handlePreview(user)}
                    cursor={"pointer"}
                  />
                  {user.isBlocked ? (
                    <CgUnblock
                      onClick={() => handleUnBlock(user)}
                      cursor={"pointer"}
                    />
                  ) : (
                    <MdBlock
                      onClick={() => handleBlock(user)}
                      cursor={"pointer"}
                    />
                  )}
                  <MdDelete
                    onClick={() => handleDelete(user)}
                    cursor={"pointer"}
                  />
                </div>
              </div>
              {preview && user._id === userDetails._id && (
                <div className="flex flex-col gap-2 ml-3 shadow-2xl rounded-2xl bg-cyan-200 p-3">
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

export default React.memo(ManageUser);
