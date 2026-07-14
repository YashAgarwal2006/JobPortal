import api from "./axios";

export const getMyCompany=async()=>{
    const {data} = await api.get("/company/profile");
    return data;
}

export const updateCompanyProfile=async(companyData)=>{
    const {data} = await api.put("/company/profile",companyData);
    return data;
}

export const updateCompanyLogo=async(companyId,formData)=>{
    const {data} = await api.put("/company/"+companyId+"/logo",formData);
    return data;
}
export const toggleStatus=async()=>{
    const {data} = await api.patch("/company/status");
    return data;
}
export const deleteCompany=async(companyId)=>{
    const {data}=await api.delete("/company/"+companyId);
    return data;
}