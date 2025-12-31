// This file is deprecated - use clapsService.jsx instead
// Keeping for backward compatibility, redirecting to claps API

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Like a post (now uses claps)
export const likePost = async (postId, token) => {
  try {
    const res = await fetch(`${BASE_URL}/api/claps/${postId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ count: 1 }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to clap");
    }

    return res.json();
  } catch (err) {
    console.error("likePost error:", err);
    return { success: false };
  }
};

// Unlike a post (remove claps)
export const unlikePost = async (postId, token) => {
  try {
    const res = await fetch(`${BASE_URL}/api/claps/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to remove claps");
    }

    return res.json();
  } catch (err) {
    console.error("unlikePost error:", err);
    return { success: false };
  }
};

// Get likes count (now claps count)
export const getLikesCount = async (postId) => {
  try {
    const res = await fetch(`${BASE_URL}/api/claps/${postId}/count`);
    if (!res.ok) throw new Error("Failed to get claps count");
    return res.json();
  } catch (err) {
    console.error("getLikesCount error:", err);
    return { count: 0 };
  }
};

// Check if user liked (now check user claps)
export const checkUserLiked = async (postId, token) => {
  try {
    const res = await fetch(`${BASE_URL}/api/claps/${postId}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to check clap status");
    const data = await res.json();
    return { liked: (data.count || 0) > 0 };
  } catch (err) {
    console.error("checkUserLiked error:", err);
    return { liked: false };
  }
};

// Get list of users who liked (clappers)
export const getLikesList = async (postId) => {
  try {
    const res = await fetch(`${BASE_URL}/api/claps/${postId}/list`);
    if (!res.ok) throw new Error("Failed to fetch clappers list");
    return res.json();
  } catch (err) {
    console.error("getLikesList error:", err);
    return [];
  }
};
