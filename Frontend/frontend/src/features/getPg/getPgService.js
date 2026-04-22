import API from "../../services/api";
export const getPg = ()=>{
    return API.get("/pgs");
}
export const updatePg = (id,data)=>{
    return API.put(`/pgs/${id}`,data);
}
export const deletePg = (id)=>{
    return API.delete(`/pgs/${id}`);
}