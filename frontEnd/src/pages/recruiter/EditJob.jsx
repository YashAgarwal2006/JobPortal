import React from 'react'
import { useState,useEffect } from 'react'
import { getJobById,updateJobById } from '../../api/jobApi'
import { useNavigate,useParams } from 'react-router-dom'

const EditJob = () => {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    skillsRequired: "",
    responsibilities: "",
    salary: "",
    experienceLevel: "",
    location: "",
    employmentType: "fulltime",
    workMode: "onsite",
    status: "open"
  });
  const [error, setError] = useState("");
  const [saving,setSaving] = useState(false);
  const {jobId} = useParams();

  //handling change in input data
  const handleChange = (e) => {
    const newJobData = { ...jobData };
    newJobData[e.target.name] = e.target.value;
    setJobData(newJobData);
  }
  //handling submit
  const handleSubmit = async () => {
    //validate first
    if (!jobData.title.trim() || !jobData.description.trim() ||
      !jobData.location.trim()) {
      setError("Please fill all required fields.");
      return;
    }
    //convert skills required to an array
    const updatedSkillsRequired = jobData.skillsRequired
    .split(",")
    .map(skill => skill.trim())
    .filter(skill => skill !== "");

    //convert responsibilities to an array
    const updatedResponsibilities = jobData.responsibilities
    .split(",")
    .map(item => item.trim())
    .filter(item => item !== "");

    const updatedJobData = { ...jobData };
    updatedJobData.skillsRequired = updatedSkillsRequired;
    updatedJobData.responsibilities = updatedResponsibilities;
    setSaving(true);
    try {
      setError("");
      await updateJobById(jobId,updatedJobData);
      navigate("/recruiter/jobs");

    } catch (err) {
      setError(err.message || "Unable to post job.")
    }finally{
      setSaving(false);
    }

  }
  useEffect(() => {
    const getJob=async(jobId)=>{
        try{
            setError("");
            const {job} = await getJobById(jobId);
            setJobData({...job ,
                skillsRequired : job.skillsRequired.join(", "),
                responsibilities: job.responsibilities.join(", ")
            })
        }catch(err){
            setError(err.message || "Unable to fetch job");
        }
    }
    getJob(jobId);
  }, [jobId])
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Edit Job
        </h1>
        {/* Title*/}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Job Title
          </label>
          <input type="text" name="title" onChange={handleChange}
            value={jobData.title || ""}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        {/* Description*/}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea name="description" onChange={handleChange}
            value={jobData.description || ""} placeholder='Describe the role...'
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        {/* Skills*/}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Skills Required
          </label>
          <input type="text" name="skillsRequired" onChange={handleChange}
            value={jobData.skillsRequired || ""} placeholder='React,Node.js,MongoDB...'
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        {/* Responsibilities*/}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Responsibilities
          </label>
          <textarea name="responsibilities" onChange={handleChange}
            value={jobData.responsibilities || ""} placeholder='Develop APIs,Review PRs...'
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        {/* Salary*/}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Salary ₹
          </label>
          <input type="number" min="0" name="salary" onChange={handleChange}
            value={jobData.salary}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        {/* Experience*/}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Experience Level Required
          </label>
          <input type="number" min="0" name="experienceLevel" onChange={handleChange}
            value={jobData.experienceLevel}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        {/* Location*/}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Location
          </label>
          <input type="text" name="location" onChange={handleChange}
            value={jobData.location || ""}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        {/* Employment Type*/}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Employment Type
          </label>
          <select name="employmentType" onChange={handleChange}
            value={jobData.employmentType} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="fulltime">Full Time</option>
            <option value="parttime">Part Time</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
          </select>
        </div>
        {/*Work Mode*/}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Work Mode
          </label>
          <select name="workMode" onChange={handleChange}
            value={jobData.workMode} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
          </select>
        </div>
        {/*Status*/}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status
          </label>
          <select name="status" onChange={handleChange}
            value={jobData.status} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* error */}
        {error &&
          <p className='text-red-600 text-center mb-4'>{error}</p>
        }
        {/* submit button */}
        <div className='flex justify-center mt-8'>
          <button disabled={saving} type="button" onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">
            {saving? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditJob;
