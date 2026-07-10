import React from 'react'
import { useState,useEffect,useContext,createContext } from 'react'
import * as authApi from "../api/authApi";

//Create a context
const AuthContext = createContext();

//provider function
export function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    //check if user is already logged in
    const checkAuth=async()=>{
        try{
            const data = await authApi.getCurrentUser();
            setUser(data.user);
            setIsAuthenticated(true);
        }catch(err){
            setUser(null);
            setIsAuthenticated(false);
        }finally{
            setLoading(false);
        }
    };

    //login
    const login=async(credentials)=>{
        try{
            const data = await authApi.login(credentials);
            setUser(data.user);
            setIsAuthenticated(true);
            return data;
        }catch(err){
            throw err.response?.data || {
                message:"Something went wrong"
            };
        }
    }
    
    //Logout
    const logout = async()=>{
        try{
            await authApi.logout();
        }finally{
            setUser(null);
            setIsAuthenticated(false);
        }
    }

    //run checkAuth only during start
    useEffect(() => {
        checkAuth();
    }, [])
    
    return (
        <AuthContext.Provider value={{
            user,isAuthenticated,loading,login,logout,checkAuth
        }}>
            {children}
        </AuthContext.Provider>
    )
}

//custom hook
export function useAuth(){
    return useContext(AuthContext);
}
