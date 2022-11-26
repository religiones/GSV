import axios from "axios";
import {AxiosRequestConfig} from "axios";

const Axios = (axiosConfig: AxiosRequestConfig<any>)=>{
    const service = axios.create({
        baseURL: "http://localhost:5000",    // 设置请求前缀
        timeout: 100000,    //设置超时时长
    })
    return service(axiosConfig)
}

export default Axios;