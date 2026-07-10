import axios,{isCancel,AxiosError} from "axios";

const api = axios.create({
    baseURL:"http://localhost:5000",
    withCredentials:true,
});

export default api;