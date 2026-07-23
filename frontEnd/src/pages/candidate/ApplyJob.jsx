import React, { useEffectEvent } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useEffect, useState } from 'react'
import { Form, useNavigate } from 'react-router-dom'
import { getJobById } from '../../api/jobApi'
import { checkApplicationStatus, applyJobById } from '../../api/applicationApi'
import { useParams } from 'react-router-dom'
const ApplyJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [jobDetails, setJobDetails] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: ""
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");  //success | info


  //to handle changes in input
  const handleChange = (e) => {
    const newFormData = { ...formData };
    newFormData[e.target.name] = e.target.value;
    setFormData(newFormData);
  }

  //to handle resume change
  const handleResumeChange = (e) => {
    setSelectedResume(e.target.files[0]);
  }
  //to finish applying for the job
  const handleApply = async () => {

    try {
      setError("");
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("email", formData.email);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("bio", formData.bio);
      data.append("skills", formData.skills);
      if (selectedResume) {
        data.append("resume", selectedResume);
      } else {
        data.append("existingResume", user.resume);
      }

      await applyJobById(jobId, data);
      setMessage("🎉 Application submitted successfully! Redirecting to your dashboard...");
      setMessageType("success");
      setTimeout(() => {
        navigate("/candidate/dashboard");
      }, 2500);

    } catch (err) {
      console.log(err);
      setError(err.message || "Failed to submit application");
    }
  }
  //import job details on page load


  useEffect(() => {


    if (loading || !user) {

      return;
    }

    const initializePage = async () => {
      try {

        const { alreadyApplied } = await checkApplicationStatus(jobId);

        setAlreadyApplied(alreadyApplied);
        if (alreadyApplied) {
          setMessage("You have already applied for this job. Redirecting to your applications...");
          setMessageType("info")
          setTimeout(() => {
            navigate("/candidate/applications");
          }, 3000);
          return;
        }


        const { job } = await getJobById(jobId);

        setJobDetails(job);

        setFormData({
          fullName: user.fullName || "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
          bio: user.bio || "",
          skills: Array.isArray(user.skills)
            ? user.skills.join(", ")
            : ""
        });
      } catch (err) {
        setError(err.message || "Unable to fetch job details")
      }
    };
    initializePage();
  }, [user, jobId, loading, navigate])

  //at start
  if (loading) {
    return (
      <div className='min-h-screen flex justify-center items-center'>
        Loading...
      </div>
    )
  }
  if (alreadyApplied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-700 mb-3">
            Already Applied
          </h2>

          <p className="text-gray-600">
            You have already applied for this job.
          </p>

          <p className="text-sm text-gray-500 mt-3">
            Redirecting to your applications...
          </p>
        </div>
      </div>
    );
  }
  if (!jobDetails) {
    return (
      <div className='min-h-screen flex justify-center items-center'>
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/*Page Heading */}
        <div className='flex justify-center items-center mb-8'>
          <h1 className='text-center text-3xl font-bold text-gray-800'>
            Apply for Job
          </h1>
        </div>

        {/*Message */}
        {message && (
          <div
            className={`mb-6 rounded-lg px-5 py-4 text-center font-medium shadow-sm ${messageType === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-blue-50 border border-blue-200 text-blue-700"
              }`}
          >
            {message}
          </div>
        )}

        {/*Error */}
        <div>
          {error &&
            <p className="text-red-600 text-center mb-5">{error}</p>}
        </div>

        {/*Job Details */}
        <div className='flex justify-center items-center mb-8'>
          <h2 className='text-3xl font-bold text-gray-800'>
            Job Details
          </h2>
        </div>
        <div key={jobDetails._id} className="border rounded-xl shadow-sm p-6 bg-white">

          {/* Header */}
          <div className="flex justify-between items-start">
            <div className='flex items-start gap-4'>

              {/*Company Logo */}
              {jobDetails.company.logo ? (
                <img src={jobDetails.company.logo} alt={jobDetails.company.companyName} className='w-16 h-16 rounded-full object-cover border' />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow">
                  {jobDetails.company.companyName[0].toUpperCase()}
                </div>
              )}
            </div>
            <div>

              <p className='text-lg font-medium text-gray-600'>
                {jobDetails.company.companyName}
              </p>

              <h2 className='text-2xl font-semibold text-gray-800'>
                {jobDetails.title}
              </h2>

              <p className='text-gray-500 mt-1 text-lg'>
                <span className='font-semibold'>Posted On : </span>{" "}
                {new Date(jobDetails.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </p>

              <p className='text-gray-500 mt-1 text-lg'>
                <span className='font-semibold'>Location : </span>{" "}
                {jobDetails.location}
              </p>
            </div>

            <span className={`px-3 py-1 rounded-full text-sm font-medium ${jobDetails.status === "open"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
              }`}>{jobDetails.status.toUpperCase()}
            </span>
          </div>

          {/* Basic Details */}
          <div className='grid grid-cols-2 gap-4 mt-6 text-gray-700'>
            <div className='bg-gray-50 rounded-lg p-3'>
              <p>
                <span className='font-semibold'>Salary:</span>{" "}₹{jobDetails.salary.toLocaleString("en-IN")}
              </p>
            </div>

            <div className='bg-gray-50 rounded-lg p-3'>
              <p>
                <span className='font-semibold'>Experience:</span>{" "}{jobDetails.experienceLevel}
              </p>
            </div>

            <div className='bg-gray-50 rounded-lg p-3'>
              <p>
                <span className='font-semibold'>Employment:</span>{" "}{jobDetails.employmentType.charAt(0).toUpperCase() + jobDetails.employmentType.slice(1)}
              </p>
            </div>

            <div className='bg-gray-50 rounded-lg p-3'>
              <p>
                <span className='font-semibold'>Work Mode:</span>{" "}{jobDetails.workMode.charAt(0).toUpperCase() + jobDetails.workMode.slice(1)}
              </p>
            </div>
          </div>

          <div className='mt-6 border-t pt-6'>

            {/*Description*/}
            <div className='mb-5'>
              <h3 className='font-semibold text-lg mb-2'>Description</h3>
              <p className='text-gray-700'>{jobDetails.description}</p>
            </div>

            {/*Skills*/}
            <div className='mb-5'>
              <h3 className='font-semibold text-lg mb-2'>Skills Required</h3>
              <div className='flex flex-wrap gap-2'>
                {jobDetails.skillsRequired.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{skill}</span>
                ))}
              </div>
            </div>

            {/*Responsibilities*/}
            <div className='mb-5'>
              <h3 className='font-semibold text-lg mb-2'>Responsibilities</h3>
              <ul className="list-disc list-inside space-y-1">
                {jobDetails.responsibilities.map((responsibility, index) => (
                  <li key={index}>
                    {responsibility}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/*Apply form */}
        <div className='bg-white rounded-xl shadow-sm p-8 mt-10'>
          {/* Heading */}
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Your Application
          </h1>

          {/* Full Name */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text" required name="fullName" value={formData.fullName || ""}
              onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input name="email" required type="email" value={formData.email} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          {/* Phone */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input type="tel" required name="phoneNumber" value={formData.phoneNumber || ""}
              onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bio
            </label>
            <textarea rows={4} required name="bio" value={formData.bio || ""}
              onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
          </div>

          {/* Skills */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Skills
            </label>
            <input type="text" required name="skills" value={formData.skills}
              onChange={handleChange} placeholder="React, Node.js, MongoDB"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          {/* Resume */}
          <div className="border-b py-4">
            <p className="font-semibold text-gray-600 mb-3">
              Resume
            </p>

            {user.resume ? (
              <div className="mb-4">
                <a href={user.resume} target="_blank"
                  rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  📄 View Current Resume
                </a>
              </div>
            ) : (
              <p className="text-gray-500 mb-4">
                No resume uploaded
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <input required type="file" accept=".pdf" onChange={handleResumeChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700
                 file:font-semibold hover:file:bg-blue-100"
              />
            </div>

            {selectedResume && (
              <p className="text-sm text-gray-500 mt-2">
                Selected: {selectedResume.name}
              </p>
            )}
          </div>

          <button
            onClick={handleApply}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Submit Application 🚀
          </button>
        </div>
      </div>
    </div>
  )
}

export default ApplyJob
