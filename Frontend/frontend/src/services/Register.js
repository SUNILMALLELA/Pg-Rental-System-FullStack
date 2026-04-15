import API from "./api";
export const registerUser = (data)=>{
return API.post("/register",data);
};