const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Add claps (Medium style - can clap multiple times)
export const addClaps = async (postId, token, count = 1) => {
  const res = await fetch(`${BASE_URL}/api/claps/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ count }),
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to clap");
  }
  return res.json();
};

// Remove all claps
export const removeClaps = async (postId, token) => {
  const res = await fetch(`${BASE_URL}/api/claps/${postId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  
  if (!res.ok) throw new Error("Failed to remove claps");
  return res.json();
};

// Get claps count
export const getClapsCount = async (postId) => {
  const res = await fetch(`${BASE_URL}/api/claps/${postId}/count`);
  if (!res.ok) throw new Error("Failed to get claps count");
  return res.json();
};

// Get user's claps on a post
export const getUserClaps = async (postId, token) => {
  const res = await fetch(`${BASE_URL}/api/claps/${postId}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to get user claps");
  return res.json();
};

// Get list of clappers
export const getClappersList = async (postId) => {
  const res = await fetch(`${BASE_URL}/api/claps/${postId}/list`);
  if (!res.ok) throw new Error("Failed to get clappers");
  return res.json();
};
