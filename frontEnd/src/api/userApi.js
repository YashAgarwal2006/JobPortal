import api from "./axios";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser } from "./authApi";

export const getProfile=async()=>{
    const {data} = await api.get("/user/profile");
    return data;
}

export const updateProfile=async(userData)=>{
    const {data} = await api.put("/user/profile",userData);
    return data;
}

export const updateProfilePhoto=async(formData)=>{
    const {data} = await api.put("/user/profile/photo",formData);
    return data;
}

export const updateResume=async(formData)=>{
    const {data} = await api.put("/user/profile/resume",formData);
    return data;
}