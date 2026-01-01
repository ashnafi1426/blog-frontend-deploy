const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Add bookmark
export const addBookmark = async (postId, token) => {
  const res = await fetch(`${BASE_URL}/api/bookmarks/${postId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to bookmark");
  return res.json();
};

// Remove bookmark
export const removeBookmark = async (postId, token) => {
  const res = await fetch(`${BASE_URL}/api/bookmarks/${postId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to remove bookmark");
  return res.json();
};

// Check if bookmarked
export const checkBookmark = async (postId, token) => {
  const res = await fetch(`${BASE_URL}/api/bookmarks/${postId}/check`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return { isBookmarked: false };
  return res.json();
};

// Get user's bookmarks
export const getBookmarks = async (token, { page = 1, limit = 10 } = {}) => {
  const res = await fetch(`${BASE_URL}/api/bookmarks?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to get bookmarks");
  return res.json();
};
