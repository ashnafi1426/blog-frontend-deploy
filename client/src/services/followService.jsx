const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Follow user
export const followUser = async (userId, token) => {
  const res = await fetch(`${BASE_URL}/api/follow/users/${userId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to follow");
  return res.json();
};

// Unfollow user
export const unfollowUser = async (userId, token) => {
  const res = await fetch(`${BASE_URL}/api/follow/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to unfollow");
  return res.json();
};

// Check if following
export const checkFollowing = async (userId, token) => {
  const res = await fetch(`${BASE_URL}/api/follow/users/${userId}/check`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return { isFollowing: false };
  return res.json();
};

// Get followers
export const getFollowers = async (userId, token, { page = 1, limit = 20 } = {}) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${BASE_URL}/api/follow/users/${userId}/followers?page=${page}&limit=${limit}`, { headers });
  if (!res.ok) throw new Error("Failed to get followers");
  return res.json();
};

// Get following
export const getFollowing = async (userId, token, { page = 1, limit = 20 } = {}) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${BASE_URL}/api/follow/users/${userId}/following?page=${page}&limit=${limit}`, { headers });
  if (!res.ok) throw new Error("Failed to get following");
  return res.json();
};

// Get follow counts
export const getFollowCounts = async (userId) => {
  const res = await fetch(`${BASE_URL}/api/follow/users/${userId}/counts`);
  if (!res.ok) throw new Error("Failed to get counts");
  return res.json();
};

// Follow topic
export const followTopic = async (topicId, token) => {
  const res = await fetch(`${BASE_URL}/api/follow/topics/${topicId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to follow topic");
  return res.json();
};

// Unfollow topic
export const unfollowTopic = async (topicId, token) => {
  const res = await fetch(`${BASE_URL}/api/follow/topics/${topicId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to unfollow topic");
  return res.json();
};

// Get followed topics
export const getFollowedTopics = async (token) => {
  const res = await fetch(`${BASE_URL}/api/follow/topics/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to get topics");
  return res.json();
};
