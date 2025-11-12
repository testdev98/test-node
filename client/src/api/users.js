import axiosInstance from "./index";

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get("/me");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user profile" };
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/admin/user", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create user" };
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await axiosInstance.put(`/admin/user/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to update user profile due to an unexpected error.";
    throw { message: errorMessage, originalError: error };
  }
};

export const updateSubscribeService = async (id, userData) => {
  try {
    const response = await axiosInstance.put(`/admin/user/subscibe-service/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to update user profile due to an unexpected error.";
    throw { message: errorMessage, originalError: error };
  }
};

export const getUsers = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/admin/user", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch users" };
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(`admin/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user" };
  }
};
