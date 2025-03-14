import React, { useEffect } from "react";
import {
  deleteSavedLog,
  useGetSavedLogsQuery,
} from "../../Features/SavedLogFeature";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

const SavedLogs = () => {
  const { data: savedLogs, isLoading } = useGetSavedLogsQuery();
  // console.log(savedLogs?.savedLog);
  const { isDeleted } = useSelector((state) => state.savedLog);
  const dispatch = useDispatch();

  const deleteSavedPost = (log) => {
    if (window.confirm("Are you sure want to delete this saved post")) {
      dispatch(deleteSavedLog(log._id));
    }
  };

  useEffect(() => {
    if (isDeleted) {
      toast.success("Saved Log Deleted Successfully", {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      window.location.reload();
    }
  }, [isDeleted]);

  return (
    <div className="">
      <ToastContainer />
      {savedLogs?.savedLog?.length > 0 ? (
        <div className="w-full p-4">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="flex items-center justify-between w-full flex-wrap gap-3">
              {savedLogs?.savedLog?.map((log) => {
                return (
                  <div
                    key={log._id}
                    className="capitalize border-2 w-full md:w-2/4 sm-full m-auto p-2 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <p>Saved By: {log.user.name}</p>
                      <RiDeleteBin3Fill
                        onClick={() => deleteSavedPost(log)}
                        cursor={"pointer"}
                        fill="red"
                      />
                    </div>
                    <p>Posted By: {log.travelLog.user.name}</p>
                    <h1>Title: {log.travelLog.title}</h1>
                    <p>Description: {log.travelLog.description}</p>
                    <p>Budget Of Travel: {log.travelLog.cost} ₹INR</p>
                    <div className="flex items-center gap-2">
                      <p>
                        From Location:{" "}
                        {log.travelLog.fromLocation.split(",")[0]},
                      </p>
                      <p>
                        To Location: {log.travelLog.toLocation.split(",")[0]}
                      </p>
                    </div>
                    <p>
                      Date of Post:{" "}
                      {new Date(log.travelLog.createdAt).toLocaleDateString()}
                    </p>
                    <p>
                      Saved At: {new Date(log.savedAt).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <p>No Saved Logs</p>
      )}
    </div>
  );
};

export default SavedLogs;
