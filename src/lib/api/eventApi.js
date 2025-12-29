import axiosInstance from "../../axiosInstance";

export const eventApi = {
  getAllEvents: async (params = {}) => {
    const response = await axiosInstance.get("/events", { params });
    return response.data;
  },

  getEventById: async (id) => {
    const response = await axiosInstance.get(`/events/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await axiosInstance.get("/events/categories");
    return response.data;
  },

  createEvent: async (data) => {
    const response = await axiosInstance.post("/events", data);
    return response.data;
  },

  updateEvent: async (id, data) => {
    const response = await axiosInstance.put(`/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await axiosInstance.delete(`/events/${id}`);
    return response.data;
  },

  getUserEvents: async () => {
    const response = await axiosInstance.get("/events/user/my-events");
    return response.data;
  },

  getUserStats: async () => {
    const response = await axiosInstance.get("/events/user/stats");
    return response.data;
  },
};
