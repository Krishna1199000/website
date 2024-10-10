import axios from 'axios'

export const axiosInstance = axios.create({});
export const apiConnector = (method, url, bodyData=null,options={}) => {
    return axiosInstance({
        method: method.toLowerCase(),
        url : url,
        data: bodyData,
        headers: options.headers || {},
        params : options.params || {},

    });
};