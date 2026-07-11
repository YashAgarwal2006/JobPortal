import React from 'react'
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {login} = useAuth();
  const navigate = useNavigate();

  
  //handle login form submission
  const handleSubmit=async(e)=>{
    e.preventDefault();
    setError("");
    setLoading(true);
    const credentials = {email,password};
    try{
      const data = await login(credentials);
      if(data.user.role==="candidate"){
        navigate("/candidate/dashboard");
      }else{
        navigate("/recruiter/dashboard");
      }
    }catch(err){
      setError(err.message || "Something went wrong");
    }finally{
      setLoading(false);
    }
    
  }
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email : 
          <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}></input>
        </label>
      </div>
      
      <div>
        <label>Password : 
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}></input>
        </label>
      </div>
      {/* Show error if any */}
      {error && 
      <p>{error}</p>
      }
      <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      
    </form>
  )
}

export default Login;
