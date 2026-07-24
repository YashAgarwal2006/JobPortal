import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from "react-icons/fa"

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const RoleOptions = [
    { label: "Candidate", value: "candidate" },
    { label: "Recruiter", value: "recruiter" }
  ];

  //Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    //validate password and conform password
    if (password !== confirmPassword) {
      setError("password and confirm password do not match");
      setLoading(false);
      return;
    }
    if (!fullName || !email || !password || !phoneNumber ||
      !role) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }
    const userData = { fullName, email, password, confirmPassword, phoneNumber, role };
    try {
      const data = await signup(userData);
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
        <h1 className='text-3xl font-bold text-center text-gray-800 mb-2'>Create Account</h1>
        <p className='text-center text-gray-500 mb-8'>Join us and start your journey</p>
        {/* Show error if any */}
        {error &&
          <p className='bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-center mb-6'>{error}</p>
        }

        <form onSubmit={handleSubmit} className='space-y-5'>
          {/*Full Name */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Full Name:</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder='Enter your full name'
              className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none'></input>
          </div>
          {/*Email */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter your email'
              className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none'></input>
          </div>
          {/*Password */}
          <div >
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password:</label>
            <div className='relative'>
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter your password'
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-28 focus:ring-2 focus:ring-blue-500 outline-none" required />
              <button type="button" onClick={() => setShowPassword(prev => !prev)} className='absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 font-medium hover:text-blue-800'>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {/*Confirm Password */}
          <div >
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password:</label>
            <div className='relative'>
              <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirm your password'
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-28 focus:ring-2 focus:ring-blue-500 outline-none" required />
              <button type="button" onClick={() => setShowPassword(prev => !prev)} className='absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 font-medium hover:text-blue-800'>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {/*Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number:</label>
              <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} maxLength={10} placeholder='9876543210' required
              className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none'></input>
          </div>
          {/*Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Register As:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} required
                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="" disabled>-- Select a role --</option>
                {RoleOptions.map((opt) => {
                  return (<option key={opt.value} value={opt.value}>{opt.label}</option>)
                })}
              </select>
          </div>

          {/*Signup button */}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-lg font-semibold transition">
            {loading ? "Signing up..." : "Create Account"}</button>

        </form>
        {/*Login link*/}
        <div className='text-center mt-8'>
          <span className='text-gray-600'>Already have an account?{" "}</span>
          <button type="button" onClick={() => navigate("/login")} className="text-blue-600 hover:text-blue-800 hover:cursor-pointer font-semibold">Login</button>
        </div>
      </div>
    </div>
  )
}

export default Signup
