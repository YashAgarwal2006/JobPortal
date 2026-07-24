import React from 'react'
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const { login } = useAuth();
  const navigate = useNavigate();


  //handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }
    setError("");
    setLoading(true);
    const credentials = { email, password };
    try {
      const data = await login(credentials);
      if (data.user.role === "candidate") {
        navigate("/candidate/dashboard");
      } else {
        navigate("/recruiter/dashboard");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  if (loading) {
    return (
      <div className='min-h-screen flex justify-center items-center'>
        Loading...
      </div>
    )

  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {/*Back button */}
        <div className='mb-6'>
          <button type="button" onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-800 hover:cursor-pointer font-medium flex items-center gap-2">
            ← Back
          </button>

        </div>
        {/*Heading */}
        <h1 className='text-3xl font-bold text-center text-gray-800 mb-2'>Welcome</h1>
        <p className='text-center text-gray-500 mb-8'>Login to continue to your account</p>
        {/* Show error if any */}
        {error &&
          <p className='bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-center mb-6'>{error}</p>
        }

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/*Email */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Email :</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter your email'
              className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none' required></input>
          </div>

          {/*Password */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Password :</label>
            <div className='relative'>
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter your password'
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-28 focus:ring-2 focus:ring-blue-500 outline-none" required />
              <button type="button" onClick={() => setShowPassword(prev => !prev)} className='absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 font-medium hover:text-blue-800'>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

          </div>

          {/*Login button */}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 hover:cursor-pointer disabled:bg-blue-300
                     text-white py-3 rounded-lg font-semibold transition">{loading ? "Logging in..." : "Login"}</button>
        </form>
        {/*Signup link*/}
        <div className='text-center mt-8'>
          <span className='text-gray-600'>Dont have an account?{" "}</span>
          <button type="button" onClick={() => navigate("/signup")} className="text-blue-600 hover:text-blue-800 hover:cursor-pointer font-semibold">Create Account</button>
        </div>
      </div>
    </div>
  )
}

export default Login;
