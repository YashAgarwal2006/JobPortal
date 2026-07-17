import api from "./axios";

export const applyJobById=async(jobId)=>{
    const {data} = await api.post(`/application/${jobId}`);
    return data;
}

export const getAllApplications = async() =>{
    const {data} = await api.get("/application/myApplications");
    return data;
}

export const getApplicationsByJobId=async(jobId)=>{
    const {data} = await api.get(`/application/job/${jobId}`);
    return data;
}

export const updateStatus = async(applicationId,newStatus)=>{
    const {data} = await api.put(`/application/${applicationId}`,{newStatus});
    return data;
}

export const getRecentApplications = async()=>{
    const {data} = await api.get("/application/recent");
    return data;
}