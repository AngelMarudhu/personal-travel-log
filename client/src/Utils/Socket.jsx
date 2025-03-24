import { io } from "socket.io-client";
import { useState, useEffect } from "react";

// const socket = io("http://localhost:9000", {
//   reconnectionAttempts: 5,
//   timeout: 10000,
// });

const socket = io("https://personal-travel-log.onrender.com", {
  reconnectionAttempts: 5,
  timeout: 10000,
});

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [reportStatus, setReportStatus] = useState(null);
  const [notification, setNotification] = useState([]);
  const [socketError, setSocketError] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      setSocketError(null);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setSocketError("Failed to connect to the server. Please try again.");
    });

    socket.on("disconnect", () => {
      console.warn("Socket disconnected");
      setIsConnected(false);
      setSocketError("Disconnected from the server.");
    });

    socket.on("reportSaved", (data) => {
      setReportStatus(data.success ? "success" : "error");
    });

    socket.on("newNotification", (data) => {
      setNotification((prev) => [...prev, data]);
    });

    socket.on("error", (errorMessage) => {
      console.error("Socket Error:", errorMessage);
      setSocketError(errorMessage);
    });

    return () => {
      socket.off("reportSaved");
      socket.off("newNotification");
      socket.off("error");
    };
  }, []);

  // Based on event this promise will happen
  const emitEvent = (event, data) => {
    return new Promise((resolve, reject) => {
      socket.emit(event, data, (response) => {
        if (response?.error) {
          console.error(`Error in ${event}`, response.error);
          setSocketError(response.error);
          reject(response.error);
        } else {
          resolve(response);
        }
      });
    });
  };

  const likeTravelLog = (data) => {
    if (!data) return;
    emitEvent("likes", data).catch((err) => console.warn("Like failed", err));
  };

  const commentTravelLog = (data) => {
    if (!data) return;
    emitEvent("comment", data).catch((err) =>
      console.warn("Comment failed", err)
    );
  };

  const reportSpam = (data) => {
    if (!data) return;
    emitEvent("reportSpam", data).catch((err) =>
      console.warn("Report failed", err)
    );
  };

  return {
    isConnected,
    likeTravelLog,
    commentTravelLog,
    reportSpam,
    reportStatus,
    notification,
    socketError,
  };
};

export default useSocket;
