import API from "../../services/api";
export const addPg =(data)=>{
return API.post("/addPg",data);
}