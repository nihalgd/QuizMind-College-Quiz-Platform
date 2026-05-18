import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const authService = {
  register: async (name, email, password, department) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
        department,
      });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      throw error.response?.data || { success: false, message: "Registration failed" };
    }
  },

  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error.response?.data || { success: false, message: "Login failed" };
    }
  },
};

export default authService;
