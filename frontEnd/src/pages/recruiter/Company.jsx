import React from 'react'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getMyCompany, updateCompanyLogo, updateCompanyProfile, toggleStatus } from '../../api/companyApi'
const Company = () => {

  const { user, loading } = useAuth();
  const [companyData, setCompanyData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [error, setError] = useState("");

  if (loading) return null;
  //to handle changes in input
  const handleChange = (e) => {
    const newCompanyData = { ...companyData };
    newCompanyData[e.target.name] = e.target.value;
    setCompanyData(newCompanyData);
  }
  //to save changes after editing
  const handleSave = async () => {
    try {
      setError("");
      const { company } = await updateCompanyProfile(companyData);
      setCompanyData(company);
      setError("");
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update company profile");
    }
  }

  //handle status toggling
  const handleStatusToggle = async () => {
    try {
      const { company } = await toggleStatus();
      setCompanyData(company);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to change status");
    }
  }

  //handle logo changes
  const handleLogoChange = (e) => {
    setSelectedLogo(e.target.files[0]);
  }

  //upload company logo
  const handleLogoUpload = async () => {
    if (!selectedLogo) {
      setError("Please select a company logo first");
      return;
    }
    try {
      setError("");
      const formData = new FormData();
      formData.append("companyLogo", selectedLogo);
      const { company } = await updateCompanyLogo(companyData.id, formData);
      setCompanyData(company);
      setSelectedLogo(null);
    } catch (err) {
      setError(err.message || "Unable to upload company logo");
    }
  }
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const myCompanyData = await getMyCompany();
        setCompanyData(myCompanyData.company);
      } catch (err) {
        setError(err.message || "Unable to fetch company data");
      }
    }
    fetchCompanyData();

  }, [user])
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Company Profile
        </h1>

        {/* Current Company Logo */}
        <div className="flex flex-col items-center mb-8 gap-4">

          {companyData.logo ? (
            <img
              src={companyData.logo}
              alt="Company Logo"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 shadow"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow">
              {companyData.companyName
                ? companyData.companyName
                  .split(" ")
                  .map(word => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
                : "C"}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 items-center">

            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="block w-full text-sm text-gray-600
        file:mr-4
        file:py-2
        file:px-4
        file:rounded-lg
        file:border-0
        file:bg-blue-50
        file:text-blue-700
        file:font-semibold
        hover:file:bg-blue-100"
            />

            <button
              type="button"
              onClick={handleLogoUpload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
            >
              Upload Logo
            </button>

          </div>

          {selectedLogo && (
            <p className="text-sm text-gray-500">
              Selected: {selectedLogo.name}
            </p>
          )}

        </div>

        {/* Company Name */}
        {isEditing ? (
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Name
            </label>

            <input
              type="text"
              name="companyName"
              value={companyData.companyName || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 border-b py-4">
            <span className="font-semibold text-gray-600">Company Name</span>
            <span className="col-span-2 text-gray-800">{companyData.companyName || ""}</span>
          </div>
        )}

        {/* Description*/}
        {isEditing ? (
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>

            <textarea rows={4}
              name="description"
              value={companyData.description || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 border-b py-4">
            <span className="font-semibold text-gray-600">Description</span>
            <span className="col-span-2 text-gray-800">{companyData.description || ""}</span>
          </div>
        )}
        {/* Website*/}
        {isEditing ? (
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Website
            </label>

            <input
              type="text"
              name="website"
              value={companyData.website || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 border-b py-4">
            <span className="font-semibold text-gray-600">Website</span>
            <span className="col-span-2 text-gray-800"><a href={companyData.website} target="_blank" rel="noreferrer">{companyData.website || ""}</a></span>
          </div>
        )}
        {/* Location*/}
        {isEditing ? (
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={companyData.location || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 border-b py-4">
            <span className="font-semibold text-gray-600">Location</span>
            <span className="col-span-2 text-gray-800">{companyData.location || ""}</span>
          </div>
        )}
        {/* Status*/}
        <div className="grid grid-cols-3 border-b py-4 items-center">
          <span className="font-semibold text-gray-600">
            Status
          </span>

          <div className="col-span-2 flex items-center justify-between">

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${companyData.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
                }`}
            >
              {companyData.isActive ? "Active" : "Inactive"}
            </span>

            <button
              type="button"
              onClick={handleStatusToggle}
              className={`px-4 py-2 rounded-lg text-white font-medium transition ${companyData.isActive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {companyData.isActive ? "Deactivate Company" : "Activate Company"}
            </button>

          </div>
        </div>
        {/* Error*/}
        {error &&
          <p className="text-red-600 mt-3 text-center">{error}</p>}
        {/* Button*/}
        <div className='flex justify-center mt-8'>
          {isEditing ?
            <button type="submit" onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Save Changes
            </button>
            : <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition" onClick={() => setIsEditing(true)}>Edit Company</button>
          }
        </div>
      </div>
    </div>
  )
}
export default Company
