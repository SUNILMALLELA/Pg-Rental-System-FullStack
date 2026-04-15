import API from "./api"

export const loginUser = (data)=>{
    return API.post("/login",data);
};