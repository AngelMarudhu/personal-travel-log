import { io } from "socket.io-client";
import { useState, useEffect } from "react";

const socket = io("http://localhost:9000");

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });
  }, []);

  const likeTravelLog = (data) => {
    if (!data) return;
    socket.emit("likes", data);
  };

  const commentTravelLog = (data) => {
    if (!data) return;
    socket.emit("comment", data);
  };

  return { isConnected, likeTravelLog, commentTravelLog };
};

export default useSocket;
