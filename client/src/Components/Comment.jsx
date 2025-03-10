import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import useSocket from "../Utils/Socket";
import { useSelector } from "react-redux";
import { useGetCommentTravelLogQuery } from "../Features/TravelLogFeature";

const Comment = ({ log, onClosePreview, userId }) => {
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);
  const { commentTravelLog } = useSocket();
  const { data: logComments, isLoading } = useGetCommentTravelLogQuery(log._id);
  const { user } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setCommentInput(e.target.value);
  };

  // console.log({ logComments, isLoading });

  const handlePost = (log, e) => {
    // console.log(log);
    e.preventDefault();
    if (commentInput.trim() === "") {
      toast.error("Enter your comment", {
        position: "bottom-left",
        autoClose: 500,
      });
      return;
    }
    const commentData = {
      logId: log._id,
      comment: commentInput,
      userId,
    };
    // setComments((prev) => [...prev, commentData]);

    setComments((prev) => [...prev, commentData]);

    commentTravelLog(commentData);

    // localStorage.setItem("comments", JSON.stringify(comments));
    setCommentInput("");
  };

  // console.log(comments);
  return (
    <div className="w-full p-4">
      <ToastContainer />
      <textarea
        className="w-full border-b-2 border-gray-200 break-words focus:border-b-2 focus:outline-none resize-none "
        type="text"
        placeholder="Add Your Comment"
        value={commentInput}
        onChange={(e) => handleChange(e)}
      />
      <div className=" w-full gap-2 flex justify-evenly items-center">
        <button
          onClick={(e) => {
            handlePost(log, e);
          }}
          className="p-1 border-2 border-gray-400 rounded-2xl mt-3 w-full cursor-pointer"
        >
          Post
        </button>
        <button
          onClick={() => {
            setCommentInput("");
            onClosePreview(null);
          }}
          className="p-1 border-2 border-gray-400 rounded-2xl mt-3 w-full cursor-pointer"
        >
          Cancel
        </button>
      </div>

      <div className="mt-2 w-full">
        <h2 className="text-center text-gray-400">Comments Box</h2>
        <div>
          {comments?.map((comment, index) => (
            <div
              key={index}
              className=" flex flex-col items-start w-full m-2 border-b-2 border-gray-200"
            >
              <p>Owner: {user.name} </p>
              <p className="ml-3">Comment: {comment.comment}</p>
              <p className="text-sm text-gray-400 ml-3">
                Posted: {new Date().toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
        {isLoading && <p>Loading...</p>}
        <div>
          {!isLoading &&
            logComments?.travelLog?.map((comment) => {
              // console.log(comment);
              return (
                <div
                  key={comment._id}
                  className="flex flex-col items-start w-full m-2 border-b-2 border-gray-200"
                >
                  <p>Owner: {comment.user.name}</p>
                  <p className="ml-3">
                    Comment: {comment.text || "No comment available"}
                  </p>
                  <p className="text-sm text-gray-400 ml-3">
                    Posted: {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Comment;
