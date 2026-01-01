import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from "../../services/notificationService";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    
    const fetchUnread = async () => {
      const { count } = await getUnreadCount(token);
      setUnreadCount(count);
    };
    
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && token) {
      setLoading(true);
      try {
        const data = await getNotifications(token, { limit: 10 });
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id, token);
      setNotifications(prev => 
        prev.map(n => n.notification_id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead(token);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
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
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (!token) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-sm text-green-600 hover:text-green-700"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <p className="p-4 text-center text-gray-500">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="p-4 text-center text-gray-500">No notifications</p>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.notification_id}
                  to={getNotificationLink(notification)}
                  onClick={() => !notification.is_read && handleMarkRead(notification.notification_id)}
                  className={`
                    block p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition
                    ${!notification.is_read ? 'bg-green-50 dark:bg-green-900/20' : ''}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={notification.actor?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=default`}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">
                          {notification.actor?.display_name || notification.actor?.username || 'Someone'}
                        </span>{' '}
                        {notification.message}
                      </p>
                      {notification.post?.title && (
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {notification.post.title}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTime(notification.created_at)}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>

          <Link
            to="/notifications"
            className="block p-3 text-center text-sm text-green-600 hover:text-green-700 border-t border-gray-200 dark:border-gray-700"
            onClick={() => setIsOpen(false)}
          >
            See all notifications
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
