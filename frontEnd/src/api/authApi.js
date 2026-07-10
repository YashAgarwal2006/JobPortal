import api from "./axios";

//login
export const login=async(credentials)=>{
    const response = await api.post("/auth/login",{
        email:credentials.email,
        password:credentials.password
    });
    return response.data;
}

//signup
export const signup = async(userData)=>{
    const response = await api.post("/auth/signup",userData);
    return response.data;
}

//logout
export const logout = async()=>{
    const response = await api.post("/auth/logout");
    return response.data;
}

//get current user
export const getCurrentUser = async()=>{
    const {data} = await api.get("/user/profile");
    return data;
}


