import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const {signup} = useAuth();
    const navigate = useNavigate();

    const RoleOptions = [
      {label:"Candidate",value:"candidate"},
      {label:"Recruiter",value:"recruiter"}
    ];

    //Handle Submit
    const handleSubmit=async(e)=>{
      e.preventDefault();
      setError("");
      setLoading(true);
      //validate password and conform password
      if(password !== confirmPassword){
        setError("password and confirm password do not match");
        setLoading(false);
        return;
      }
      if (!fullName || !email || !password ||!phoneNumber ||
          !role) {
          setError("Please fill all fields");
          setLoading(false);
          return;
      }
      const userData = {fullName,email,password,confirmPassword,phoneNumber,role};
      try{
        const data = await signup(userData);
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
          <label>Full Name:
            <input type="text" value={fullName} onChange={(e)=>setFullName(e.target.value)}></input>
          </label>
        </div>
        <div>
          <label>Email:
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}></input>
          </label>
        </div>
        <div>
          <label>Password:
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}></input>
          </label>
        </div>
        <div>
          <label>Confirm Password:
            <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}></input>
          </label>
        </div>
        <div>
          <label>Phone Number:
            <input type="tel" value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)}></input>
          </label>
        </div>
        <div>
          <label>Role:
            <select id="role" value={role} onChange={(e)=>setRole(e.target.value)}>
              <option value="" disabled>-- Select a role --</option>
              {RoleOptions.map((opt)=>{
                return(<option key={opt.value} value={opt.value}>{opt.label}</option>)
              })}
            </select>
          </label>
        </div>

          {/* Show error if any */}
          {error && 
          <p>{error}</p>
          }
          <button type="submit" disabled={loading}>{loading ? "Signing up..." : "Sign Up"}</button>
        
      </form>
    )
}

export default Signup
