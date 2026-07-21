import React, { use } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getAllJobs } from '../../api/jobApi'
import { useState, useEffect,useRef } from 'react'

const Jobs = () => {
  const { user, loading } = useAuth();
  const [allJobs, setAllJobs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    keyword: "",
    skills: [],
    location: "",
    employmentType: "",
    workMode: "",
    experienceLevel: "",
    minSalary: "",
    maxSalary: "",
    page: 1,
    limit: 5
  });
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);
  const skillList = ["React", "Node.js", "MongoDB", "Express", "JavaScript", "Tailwind CSS", "HTML", "C++", "Java", "Python",
    "ML", "AI", "API"
  ]


  //used to store intermediate filters data so that API call is not made immeddiately a filter is selected. It is made only when search is clicked
  const [filterForm, setFilterForm] = useState({
    keyword: "",
    skills: [],
    location: "",
    employmentType: "",
    workMode: "",
    experienceLevel: "",
    minSalary: "",
    maxSalary: "",
  })

  //handle change in filters
  const handleFilterChange = (e) => {
    setFilterForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  //applying filters
  const handleApplyFilters = () => {
    setFilters({
      ...filterForm,
      skills: filterForm.skills.join(","),
      page: 1
    });
  }

  //handle change in skills
  const handleSkillChange = (e) => {
    const { value, checked } = e.target;
    setFilterForm((prev) => ({
      ...prev,
      skills: checked ? [...prev.skills, value] : prev.skills.filter((skill) => skill !== value),
    }))
  }
  //clearing filters
  const handleClearFilter = () => {
    const emptyFilters = {
      keyword: "",
      skills: [],
      location: "",
      employmentType: "",
      workMode: "",
      experienceLevel: "",
      minSalary: "",
      maxSalary: "",
    };
    setFilterForm(emptyFilters);
    setFilters({ ...emptyFilters, page: 1 });
  }

  //handle pagination
  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  }

  //go to previous page
  const handlePreviousPage = () => {
    setFilters(prev => ({
      ...prev,
      page: prev.page - 1
    }));
  }
  //go to next page
  const handleNextPage = () => {
    setFilters(prev => ({
      ...prev,
      page: prev.page + 1
    }));
  }

  //fetch all jobs at start or when filter change
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setError("");
        const { jobs, pagination } = await getAllJobs(filters);
        setAllJobs(jobs);
        setPagination(pagination);
      } catch (err) {
        setError(err.message || "Unable to fetch jobs");
      }
    }
    fetchJobs();
  }, [filters])

  //useEffect for filterRef
  useEffect(() => {
    const handleClickOutside=(event)=>{
      if(filterRef.current && !filterRef.current.contains(event.target)){
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown",handleClickOutside);
    return ()=>{
      document.removeEventListener("mousedown",handleClickOutside);
    }
  }, [])
  

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/*Page Heading */}
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>
            Find Your Dream Job Here
          </h1>
        </div>

        <div className='flex items-center gap-4 mb-8'>
          {/*Search bar */}
          <input type="text" name="keyword" value={filterForm.keyword} placeholder='Search by title or description...'
            onKeyDown={(e) => {
              if (e.key === "Enter") { handleApplyFilters() }
            }}
            onChange={handleFilterChange} className='flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none' />
          {/*Search button*/}

          <button onClick={handleApplyFilters} className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition'>
            Search 🔍
          </button>
          <div className='relative' ref={filterRef}>


            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg" onClick={() => setShowFilters(prev => !prev)}>Filters ▼</button>
            <button onClick={handleClearFilter} className="ml-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-medium transition">Clear Filters</button>
            {showFilters && (
              <div className='absolute right-0 top-full mt-2 w-200 bg-white shadow-lg rounded-xl p-6 z-50'>
                <div className='border-b pb-4 mb-6'>
                  <h2 className='text-2xl font-bold text-gray-800'>Filters</h2>
                  <p className='text-gray-500 text-sm mt-1'>Narrow down jobs based on your preferences.</p>
                </div>
                {/*Filters section */}
                <div>
                  {/*Skills filter */}
                  <h3 className='text-lg font-semibold mb-4'>Skills</h3>

                  <div className='grid grid-cols-4 gap-y-4 gap-x-6 mt-4'>
                    {skillList.map((skill) => (
                      <label key={skill} className='flex items-center gap-2 text-gray-700 hover:text-blue-600 cursor-pointer'>
                        <input type="checkbox" value={skill} checked={filterForm.skills.includes(skill)}
                          onChange={handleSkillChange} className='w-4 h-4' />
                        <span>{skill}</span>
                      </label>
                    ))}
                  </div>
                  <hr className='my-8 border-gray-200' />

                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>Basic Filters</h3>
                  <div className='grid grid-cols-2 gap-8'>
                    {/*Location */}
                    <div>
                      <label className='block font-semibold text-gray-700 mb-2'>Location</label>
                      <input type="text" name="location" value={filterForm.location} placeholder='Enter location' onChange={handleFilterChange}
                        className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none' />
                    </div>

                    {/*Experience */}
                    <div>
                      <label className='block font-semibold text-gray-700 mb-2'>Experience Level</label>
                      <select name="experienceLevel" value={filterForm.experienceLevel} onChange={handleFilterChange}
                        className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none'>
                        <option value="">Any</option>
                        <option value="0">0 years</option>
                        <option value="1">1 years</option>
                        <option value="2">2 years</option>
                        <option value="3">3 years</option>
                        <option value="4">4 years</option>
                        <option value="5">5+ years</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/*Employment Type */}
                <hr className='my-8 border-gray-200' />
                <div className='mt-6'>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Employment Type</h3>
                  <div className='flex flex-wrap gap-5'>
                    {["fulltime", "internship", "parttime", "contract"].map((type) => (
                      <label key={type} className='flex items-center gap-2 cursor-pointer'>
                        <input type="radio" name="employmentType" value={type} onChange={handleFilterChange}
                          checked={filterForm.employmentType === type} />
                        <span className='capitalize'>{type}</span>

                      </label>
                    ))}
                  </div>
                </div>

                {/*Work Mode */}
                <div className='mt-6'>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Work Mode</h3>
                  <div className='flex flex-wrap gap-5'>
                    {["remote", "hybrid", "onsite"].map((mode) => (
                      <label key={mode} className='flex items-center gap-2 cursor-pointer'>
                        <input type="radio" name="workMode" value={mode} onChange={handleFilterChange}
                          checked={filterForm.workMode === mode} />
                        <span className='capitalize'>{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/*Salary */}
                <hr className='my-8 border-gray-200' />
                <h3 className='text-lg font-semibold text-gray-800 mb-4'>Salary Range(₹)</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                  <div>
                    <label className='block font-semibold text-gray-700 mb-2'>Minimum Salary</label>
                    <input type="number" name="minSalary" value={filterForm.minSalary} onChange={handleFilterChange}
                      placeholder='Minimum Salary' className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none' />
                  </div>
                  <div>
                    <label className='block font-semibold text-gray-700 mb-2'>Maximum Salary</label>
                    <input type="number" name="maxSalary" value={filterForm.maxSalary} onChange={handleFilterChange}
                      placeholder='Maximum Salary' className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none' />
                  </div>
                </div>

                {/*Buttons */}
                <div className='flex justify-center gap-5 mt-10 pt-6 border-t'>
                  <button onClick={handleApplyFilters} className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition'>Apply Filters</button>
                  <button onClick={handleClearFilter} className='bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold transition'>Clear Filters</button>
                </div>
              </div>
            )}

          </div>
        </div>
        {/*Error */}
        {error &&
          <p className="text-red-600 text-center mb-5">{error}</p>}
      </div>

      {allJobs.length === 0 ? (
        <div className="text-center py-16">
          <h2 className='text-2xl font-semibold text-gray-700 mb-2'>
            No jobs posted yet
          </h2>
          <p className='text-gray-500'>
            When recruiters post , you will find them here!
          </p>
        </div>
      ) : (
        <div className='space-y-6'>

          {allJobs.map((job) => {
            console.log(job.id, job._id);

            return (
              <div key={job._id} className="border rounded-xl shadow-sm p-6 bg-white">

                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className='flex items-start gap-4'>

                    {/*Company Logo */}
                    {job.company.logo ? (
                      <img src={job.company.logo} alt={job.company.companyName} className='w-16 h-16 rounded-full object-cover border' />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow">
                        {job.company.companyName[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>

                    <p className='text-gray-500 mt-1 text-lg'>
                      {job.company.companyName}
                    </p>

                    <h2 className='text-2xl font-semibold text-gray-800'>
                      {job.title}
                    </h2>

                    <p className='text-gray-500 mt-1 text-lg'>
                      <span className='font-semibold'>Posted On : </span>{" "}
                      {new Date(job.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>

                    <p className='text-gray-500 mt-1 text-lg'>
                      <span className='font-semibold'>Location : </span>{" "}
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
                {/*Buttons */}
                <div className='flex flex-wrap gap-4 mt-6'>
                  <button className='bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg' onClick={() => navigate(`/candidate/apply/${job._id}`)}>Apply Now</button>
                </div>


              </div>
            )
          })}

          {/*Pagination Part */}
          <div className='flex justify-center items-center gap-6 mt-10'>
            <button disabled={!pagination.hasPreviousPage} onClick={handlePreviousPage}
              className={`px-5 py-2 rounded-lg font-medium transition ${pagination.hasPreviousPage
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}> &#8592; Previous </button>
            <span className='font-semibold text-gray-700'>Page {pagination.page} of {pagination.totalPages}</span>
            <button disabled={!pagination.hasNextPage} onClick={handleNextPage}
              className={`px-5 py-2 rounded-lg font-medium transition ${pagination.hasNextPage
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}> Next &#8594;</button>
          </div>
        </div>

      )}

    </div>
  )
}

export default Jobs
