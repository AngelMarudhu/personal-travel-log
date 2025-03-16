import React, { useEffect, useRef } from "react";
import {
  useGetNotificationQuery,
  useMarkAsReadAllNotificationMutation,
} from "../../Features/Admin/NotificationFeature";

const NotificationList = ({ notifications, onCloseNotificationList }) => {
  // console.log(notifications);
  const notificationRef = useRef(null);

  // console.log(notificationRef);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // console.log(event.target);

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        onCloseNotificationList(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { data: notificationList, refetch } = useGetNotificationQuery();

  const [markAsReadAllNotification] = useMarkAsReadAllNotificationMutation();

  const handleMarkAsReadAllNotification = async () => {
    try {
      await markAsReadAllNotification();
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(notificationList);

  return (
    <div ref={notificationRef}>
      <div
        id="notification-list"
        className="flex justify-between items-center mb-5 border-b-2"
      >
        <h1 className="text-center">Notification</h1>
        <button
          className="cursor-pointer text-cyan-600 disabled:cursor-not-allowed"
          onClick={() => {
            onCloseNotificationList(false);
            handleMarkAsReadAllNotification();
          }}
          disabled={notificationList?.message === "no notifications found"}
        >
          Mark As Read
        </button>
      </div>
      <div>
        <div>
          <h1>
            Total Notifications:{" "}
            {notificationList?.notifications?.length > 0 ? (
              notificationList?.notifications?.length
            ) : (
              <span>No Notifications</span>
            )}
          </h1>
        </div>
        {notificationList?.notifications?.map((notification) => (
          <div
            key={notification._id}
            className="border-b-2 p-2"
            style={{
              background: `${notification.isRead ? "white" : "lightgray"}`,
            }}
          >
            <h1>Reason: {notification.message}</h1>
            <p>Type: {notification.type}</p>
            <time dateTime={notification.createdAt}>
              Created: {new Date(notification.createdAt).toLocaleString()}
            </time>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
