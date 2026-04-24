import API from "../../services/api";

export const getOwnerBookings = () => {
  return API.get("/bookings/owner");
};

export const updateBookingStatus = (id, status) => {
  return API.put(`/bookings/${id}/status?status=${status}`);
};