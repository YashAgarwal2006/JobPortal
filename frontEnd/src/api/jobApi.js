import api from "./axios";

export const postJob=async(jobData)=>{
    const {data} = await api.post("/job",jobData);
    return data;
}

export const getMyJobs=async()=>{
    const {data} = await api.get("/job/myJobs");
    return data;
}

export const getJobById=async(jobId)=>{
    const {data} = await api.get("/job/"+jobId);
    return data;
}

export const getAllJobs=async(filters)=>{
    const {data} = await api.get("/job",{params:filters});
    return data;
}

export const updateJobById=async(jobId,jobData)=>{
    const {data} = await api.put("/job/"+jobId,jobData);
    return data;
}

export const deleteJobById = async(jobId)=>{
    const {data} = await api.delete("/job/"+jobId);
    return data;
}