import React from 'react'
import { useState, useEffect } from 'react'
import { getMyJobs, deleteJobById } from '../../api/jobApi'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [error, setError] = useState("");
  const [expandedJobs, setExpandedJobs] = useState([]);
  const { loading } = useAuth();
  const navigate = useNavigate();

  if(loading)return null;
  //navigte to view applications
  const handleViewApplications = (jobId) => {
    navigate(`/recruiter/applicants/${jobId}`)
  }
  //navigate to edit job
  const handleEditJob = (jobId) => {
    navigate(`/recruiter/edit-job/${jobId}`);
  }
  //deleting a job
  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;
    try {
      await deleteJobById(jobId);
      setMyJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (err) {
      setError(err.message || "Unable to delete job");
    }
  }
  //toggle function for showing additional details
  const handleToggleExpand = (jobId) => {
    if (expandedJobs.includes(jobId)) {
      setExpandedJobs(expandedJobs.filter(id => id !== jobId));
    } else {
      setExpandedJobs([...expandedJobs, jobId]);
    }
  };

  //get all jobs of the current recruiter at page load
  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        setError("");
        const { jobs } = await getMyJobs();
        setMyJobs(jobs);
      } catch (err) {
        setError(err.message || "Unable to fetch jobs");
      }
    }
    fetchMyJobs();
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/* heading and post job button */}
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>
            Your Posted Jobs
          </h1>

          <button onClick={()=>navigate("/recruiter/post-job")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition">
            + Post New Job
          </button>
        </div>

        {error &&
          <p className="text-red-600 text-center mb-5">{error}</p>}

        {/* No jobs */}
        {myJobs.length === 0 ? (
          <div className="text-center py-16">
            <h2 className='text-2xl font-semibold text-gray-700 mb-2'>
              No jobs posted yet
            </h2>
            <p className='text-gray-500'>
              Start by posting your first opening.
            </p>
          </div>

        ) : (
          <div className='space-y-6'>
            {myJobs.map((job) => {
              console.log(job.id,job._id);
              const isExpanded = expandedJobs.includes(job.id);
              return (
                <div key={job.id} className="border rounded-xl shadow-sm p-6 bg-white">

                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className='text-2xl font-semibold text-gray-800'>
                        {job.title}
                      </h2>

                      <p className='text-gray-500 mt-1'>
                        {job.location}
                      </p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${job.status === "open"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}>{job.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Basic Details */}
                  <div className='grid grid-cols-2 gap-4 mt-6 text-gray-700'>
                    <p>
                      <span className='font-semibold'>Salary:</span>{" "}₹{job.salary}
                    </p>

                    <p>
                      <span className='font-semibold'>Experience:</span>{" "}{job.experienceLevel} years
                    </p>

                    <p>
                      <span className='font-semibold'>Employment:</span>{" "}{job.employmentType}
                    </p>

                    <p>
                      <span className='font-semibold'>Work Mode:</span>{" "}{job.workMode}
                    </p>
                  </div>

                  {/* Applications */}
                  <div className='mt-5'>
                    <span className='font-semibold'>Applications:</span>{" "}{job.applicationCount}
                  </div>

                  {/* Expand button */}
                  <div className='mt-5'>
                    <button onClick={() => handleToggleExpand(job.id)} className="text-blue-600 hover:text-blue-800 font-medium">
                      {isExpanded ? "Hide Details ▲"
                        : "Show Details ▼"}
                    </button>
                  </div>

                  {/*Expanded section */}
                  {isExpanded && (
                    <div className='mt-6 border-t pt-6'>

                      {/*Description*/}
                      <div className='mb-5'>
                        <h3 className='font-semibold text-lg mb-2'>Description</h3>
                        <p className='text-gray-700'>{job.description}</p>
                      </div>

                      {/*Skills*/}
                      <div className='mb-5'>
                        <h3 className='font-semibold text-lg mb-2'>Skills Required</h3>
                        <div className='flex flex-wrap gap-2'>
                          {job.skillsRequired.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{skill}</span>
                          ))}
                        </div>
                      </div>

                      {/*Responsibilities*/}
                      <div className='mb-5'>
                        <h3 className='font-semibold text-lg mb-2'>Responsibilities</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {job.responsibilities.map((responsibility, index) => (
                            <li key={index}>
                              {responsibility}
                            </li>
                          ))}
                        </ul>
                      </div>


                    </div>
                  )}
                  {/*Buttons */}
                  <div className='flex flex-wrap gap-4 mt-6'>
                    <button className='bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg' onClick={() => handleEditJob(job.id)}>Edit Job</button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg" onClick={() => handleViewApplications(job.id)} >View Applications</button>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg" onClick={() => handleDeleteJob(job.id)}>Delete Job</button>
                  </div>


                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyJobs
