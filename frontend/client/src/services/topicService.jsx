const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Get all topics
export const getAllTopics = async () => {
  const res = await fetch(`${BASE_URL}/api/topics`);
  if (!res.ok) throw new Error("Failed to get topics");
  return res.json();
};

// Get trending topics
export const getTrendingTopics = async (limit = 10) => {
  const res = await fetch(`${BASE_URL}/api/topics/trending?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to get trending topics");
  return res.json();
};

// Get topic by slug
export const getTopicBySlug = async (slug, token = null) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${BASE_URL}/api/topics/${slug}`, { headers });
  if (!res.ok) throw new Error("Topic not found");
  return res.json();
};

// Get posts by topic
export const getPostsByTopic = async (topicId, { page = 1, limit = 10 } = {}) => {
  const res = await fetch(`${BASE_URL}/api/topics/${topicId}/posts?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to get posts");
  return res.json();
};
