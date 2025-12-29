import axiosInstance from "../../axiosInstance";

export const savedEventApi = {
  saveEvent: async (eventId) => {
    const response = await axiosInstance.post(`/saved/${eventId}`);
    return response.data;
  },

  unsaveEvent: async (eventId) => {
    const response = await axiosInstance.delete(`/saved/${eventId}`);
    return response.data;
  },

  getSavedEvents: async () => {
    const response = await axiosInstance.get("/saved");
    return response.data;
  },

  checkIfSaved: async (eventId) => {
    const response = await axiosInstance.get(`/saved/check/${eventId}`);
    return response.data;
  },
};
