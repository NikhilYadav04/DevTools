import axios from "axios";

const API_URL = "http://localhost:3000/auth";

export async function signupApi(userData) {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    console.log("Signup API Response:", response.data);
    localStorage.setItem("authToken", response.data.token);
    return response.data;
  } catch (error) {
    console.error("Signup API Error:", error.response?.data?.message);
    throw new Error(error.response?.data?.message || "Signup failed");
  }
}

export async function loginApi(credentials) {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    console.log("Login API Response:", response.data);
    localStorage.setItem("authToken", response.data.token);
    return response.data;
  } catch (error) {
    console.error("Login API Error:", error.response?.data?.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
}

export async function logoutApi() {
  try {
    localStorage.removeItem("authToken");
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Logout Error:", error.message);
    throw new Error("Logout failed");
  }
}

export async function getCurrentUserApi() {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Current User API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get User Error:", error.response?.data?.message);
    throw new Error(error.response?.data?.message || "Failed to fetch user");
  }
}
