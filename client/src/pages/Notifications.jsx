import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotifications, markAsRead, markAllAsRead } from "../services/notificationService";
import { FaBell, FaArrowLeft } from "react-icons/fa";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const data = await getNotifications(token, { limit: 100 });
        setNotifications(data || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token, navigate]);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id, token);
      setNotifications(prev =>
        prev.map(n => n.notification_id === id ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead(token);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const getNotificationLink = (notification) => {
    if (notification.post_id) return `/post/${notification.post_id}`;
    if (notification.actor?.user_id) return `/profile/${notification.actor.user_id}`;
    return '#';
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now - date) / 1000;

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.is_read;
    if (filter === "read") return n.is_read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-full transition"
          >
            <FaArrowLeft size={20} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FaBell className="text-green-600" />
              Notifications
            </h1>
            <p className="text-gray-500 mt-1">{filteredNotifications.length} notifications</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition border-b-2 ${
                filter === "all"
                  ? "text-green-600 border-green-600 bg-green-50"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition border-b-2 ${
                filter === "unread"
                  ? "text-green-600 border-green-600 bg-green-50"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`flex-1 px-4 py-3 text-sm font-medium transition border-b-2 ${
                filter === "read"
                  ? "text-green-600 border-green-600 bg-green-50"
                  : "text-gray-600 border-transparent hover:text-gray-900"
              }`}
            >
              Read ({notifications.filter(n => n.is_read).length})
            </button>
          </div>
        </div>

        {/* Mark All Read Button */}
        {unreadCount > 0 && (
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition"
            >
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <FaBell size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-lg">No notifications yet</p>
              <p className="text-gray-400 text-sm mt-1">
                {filter === "unread" ? "You're all caught up!" : "Check back later"}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.notification_id}
                onClick={() => !notification.is_read && handleMarkRead(notification.notification_id)}
                className={`
                  bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition cursor-pointer
                  ${!notification.is_read ? 'bg-green-50 border-green-200' : ''}
                `}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={notification.actor?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=default`}
                    alt=""
                    className="w-12 h-12 rounded-full flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900">
                      <span className="font-semibold">
                        {notification.actor?.display_name || notification.actor?.username || 'Someone'}
                      </span>{' '}
                      <span className="text-gray-700">{notification.message}</span>
                    </p>
                    {notification.post?.title && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        "{notification.post.title}"
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {formatTime(notification.created_at)}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className="flex-shrink-0">
                      <span className="w-3 h-3 bg-green-500 rounded-full block" />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
