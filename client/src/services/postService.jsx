const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Get all published posts
export const getAllPostsDB = async ({ page = 1, limit = 10, search } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.append('search', search);
  
  const res = await fetch(`${BASE_URL}/api/posts?${params}`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
};

// Get personalized feed
export const getFeedDB = async (token, { page = 1, limit = 10 } = {}) => {
  const res = await fetch(`${BASE_URL}/api/posts/user/feed?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch feed");
  return res.json();
};

// Get single post
export const getPostByIdDB = async (id, token = null) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${BASE_URL}/api/posts/${id}`, { headers });
  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
};

// Get user's drafts
export const getDraftsDB = async (token) => {
  const res = await fetch(`${BASE_URL}/api/posts/user/drafts`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch drafts");
  return res.json();
};

// Create post
export const createPostDB = async (token, post) => {
  if (!token) throw new Error("You must be logged in");

  // Map frontend field names to backend field names
  const payload = {
    title: post.title,
    subtitle: post.subtitle,
    content: post.content,
    cover_image: post.coverImage,
    status: post.status,
    topics: post.topics
  };

  const res = await fetch(`${BASE_URL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to create post");
  }
  return res.json();
};

// Update post
export const updatePostDB = async (token, id, post) => {
  // Map frontend field names to backend field names
  const payload = {
    title: post.title,
    subtitle: post.subtitle,
    content: post.content,
    cover_image: post.coverImage,
    status: post.status,
    topics: post.topics
  };

  const res = await fetch(`${BASE_URL}/api/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to update post");
  }
  return res.json();
};

// Publish post
export const publishPostDB = async (token, id) => {
  const res = await fetch(`${BASE_URL}/api/posts/${id}/publish`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!res.ok) throw new Error("Failed to publish post");
  return res.json();
};

// Delete post
export const deletePostDB = async (token, id) => {
  const res = await fetch(`${BASE_URL}/api/posts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!res.ok) throw new Error("Failed to delete post");
  return res.json();
};

// Search posts
export const searchPostsDB = async (query, { page = 1, limit = 10 } = {}) => {
  const res = await fetch(`${BASE_URL}/api/posts/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
};
