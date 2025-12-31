const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const BASE_URL = `${API_BASE}/api/comments`;

// Get comments for a post
export const getComments = async (postId, token) => {
  try {
    const res = await fetch(`${BASE_URL}/${postId}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch comments");
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("getComments error:", err);
    return [];
  }
};

// Add comment (supports replies with parentId)
export const addComment = async (postId, content, token, parentId = null) => {
  try {
    const res = await fetch(`${BASE_URL}/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, parent_id: parentId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to add comment");
    }
    return res.json();
  } catch (err) {
    console.error("addComment error:", err);
    throw err;
  }
};

// Update comment
export const updateComment = async (id, content, token) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to update comment");
    }
    return res.json();
  } catch (err) {
    console.error("updateComment error:", err);
    throw err;
  }
};

// Delete comment
export const deleteComment = async (id, token) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to delete comment");
    }
    return res.json();
  } catch (err) {
    console.error("deleteComment error:", err);
    throw err;
  }
};

// Clap on a comment
export const clapComment = async (commentId, token) => {
  try {
    const res = await fetch(`${BASE_URL}/${commentId}/clap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to clap comment");
    }
    return res.json();
  } catch (err) {
    console.error("clapComment error:", err);
    throw err;
  }
};
