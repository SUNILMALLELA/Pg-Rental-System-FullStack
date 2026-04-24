import API from "../../services/api";

export const getMyBookings = () => {
  return API.get("/bookings/my");
};