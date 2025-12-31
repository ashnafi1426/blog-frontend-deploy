const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api/auth`;

// Generic POST request helper
const postRequest = async (url, body) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Invalid server response");
    }

    if (!res.ok) throw new Error(data.message || "Request failed");

    return data;
  } catch (err) {
    throw new Error(err.message || "Request error");
  }
};

// Register user
export const registerUser = async (userData) => {
  return await postRequest(`${API_URL}/signup`, userData);
};

// Login user
export const loginUser = async ({ email, password }) => {
  const data = await postRequest(`${API_URL}/login`, { email, password });

  if (data.token) localStorage.setItem("token", data.token);

  return data;
};
