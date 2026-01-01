const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Get notifications
export const getNotifications = async (token, { page = 1, limit = 20, unreadOnly = false } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (unreadOnly) params.append('unreadOnly', 'true');
  
  const res = await fetch(`${BASE_URL}/api/notifications?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to get notifications");
  return res.json();
};

// Get unread count
export const getUnreadCount = async (token) => {
  const res = await fetch(`${BASE_URL}/api/notifications/unread-count`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return { count: 0 };
  return res.json();
};

// Mark as read
export const markAsRead = async (notificationId, token) => {
  const res = await fetch(`${BASE_URL}/api/notifications/${notificationId}/read`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to mark as read");
  return res.json();
};

// Mark all as read
export const markAllAsRead = async (token) => {
  const res = await fetch(`${BASE_URL}/api/notifications/read-all`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to mark all as read");
  return res.json();
};
