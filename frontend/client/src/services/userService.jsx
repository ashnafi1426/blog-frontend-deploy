const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Fetch user profile
export const getUserProfile = async (userId, token) => {
  if (!userId) throw new Error("User ID missing");

  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${BASE_URL}/api/users/${userId}`, { headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch user profile");
  }

  return res.json();
};

// Fetch user by username
export const getUserByUsername = async (username) => {
  const res = await fetch(`${BASE_URL}/api/users/username/${username}`);
  if (!res.ok) throw new Error("User not found");
  return res.json();
};

// Fetch posts by user
export const getUserPosts = async (userId, token) => {
  if (!userId) throw new Error("User ID missing");

  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${BASE_URL}/api/users/${userId}/posts`, { headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch user posts");
  }

  return res.json();
};
// Update user profile
export const updateUserProfile = async (userId, updates, token) => {
  // Validate parameters
  if (typeof updates === 'string') {
    console.error("ERROR: updates should be an object, not a string!");
    console.error("Received updates:", updates);
    console.error("Stack trace:", new Error().stack);
    throw new Error("Invalid parameters passed to updateUserProfile");
  }
  
  console.log("Updating profile - userId:", userId);
  console.log("Updating profile - updates:", JSON.stringify(updates));
  console.log("Updating profile - token exists:", !!token);
  
  const bodyStr = JSON.stringify(updates);
  console.log("Request body string:", bodyStr);
  
  const res = await fetch(`${BASE_URL}/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: bodyStr,
  });

  console.log("Response status:", res.status);

  if (!res.ok) {
    const text = await res.text();
    console.log("Error response text:", text);
    let message = "Failed to update profile";
    try {
      const data = JSON.parse(text);
      message = data.message || message;
    } catch (e) {
      message = text || message;
    }
    throw new Error(message);
  }

  return res.json();
};

// Change password
export const changePassword = async (userId, currentPassword, newPassword, token) => {
  const res = await fetch(`${BASE_URL}/api/users/${userId}/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to change password");
  }

  return res.json();
};

// Get user's bookmarks
export const getUserBookmarks = async (userId, token) => {
  const res = await fetch(`${BASE_URL}/api/users/${userId}/bookmarks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch bookmarks");
  return res.json();
};

// Get user's reading history
export const getUserReadingHistory = async (userId, token) => {
  const res = await fetch(`${BASE_URL}/api/users/${userId}/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
};
