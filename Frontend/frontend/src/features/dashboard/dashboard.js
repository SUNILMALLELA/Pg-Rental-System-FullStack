import API from "../../services/api";

export const getStatusCount = () => {
    return API.get("/user/status");
};
export const getUserBookings = () => {
  return API.get("/user/bookings");
};