import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchNotificationsThunk,
  markNotificationReadThunk,
  markAllNotificationsReadThunk,
} from "../../redux/notificationSlice";
import "./index.css";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const { activeUser } = useSelector((state) => state.huminer);
  const { notifications, loading } = useSelector((state) => state.notifications);

  const unreadNotificationCount = notifications?.filter((n) => !n.read)?.length;

  const handleMarkRead = (notificationId) => {
    dispatch(markNotificationReadThunk(notificationId));
  };

  // Mark ALL notifications as read
  const handleMarkAll = () => {
    dispatch(markAllNotificationsReadThunk(activeUser._id));
  };

  if (loading) return <div className="notification-loading">Loading...</div>;

  return (
    <div className="notification-container">
      <div className="notification-header">
        <h2>Notifications ({unreadNotificationCount} unread)</h2>

        {notifications?.length > 0 && (
          <button className="mark-all-btn" onClick={handleMarkAll}>
            Mark All as Read
          </button>
        )}
      </div>

      {notifications?.length === 0 ? (
        <div className="no-notifications">
          <p>No notifications yet.</p>
        </div>
      ) : (
        notifications?.map((note) => (
          <div
            key={note._id}
            className={`notification-item ${note.read ? "read" : "unread"}`}
            onClick={() => handleMarkRead(note._id)}
          >
            <div className="notification-message">{note.message}</div>
            <div className="notification-meta">
              <span>{new Date(note.createdAt).toLocaleString()}</span>
              {!note.read && <span className="unread-dot"></span>}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationPage;
