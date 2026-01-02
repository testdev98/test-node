import axiosInstance from "./index";

export const getServices = async () => {
    try {
        const services = await axiosInstance.get("/admin/service");
        return services.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to fetch services" };
    }
}

export const socialService = async (data) => {
    try {
        const response = await axiosInstance.post("/services/social", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to perform social service action" };
    }
}

export const trustService = async (data) => {
    try {
        const response = await axiosInstance.post("/services/trust", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Failed to perform trust service action" };
    }
}