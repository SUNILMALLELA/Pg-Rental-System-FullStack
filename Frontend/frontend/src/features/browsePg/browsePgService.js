import API from "../../services/api"
export const getAllPg = ()=>{
return API.get("/allPgs");
}
export const getAllPgById = (id)=>{
    return API.get(`/allPgs/${id}`)
}
export const searchPg = (filters) => {
  return API.get("/search", {
    params: filters
  });
};
export const createBooking = (data) => {
  return API.post("/bookings", data);
};