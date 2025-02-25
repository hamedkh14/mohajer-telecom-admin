import { getToken } from '@/utils/secureStore';
import axios from 'axios';


let token;
let api: any;

const initValues = async () => {
    token = await getToken('authToken');

    api = axios.create({
        baseURL: "https://mohajertelecom.chbk.app/api",
        // baseURL: "http://192.168.1.130:8090/api",
        // baseURL: "http://10.0.2.2:8090/api",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: '*/*',
            'Content-Type': 'application/json',
        },
        timeout: 10000,
    });
}
const request = {
    get:async (endpoint: string, options = {}) => {
        await initValues();
        return api.get(endpoint, options);
    },
    post: async(endpoint: string, data: Array<any> | Object, options = {}) => {
        await initValues();
        return api.post(endpoint, Object.assign({}, data), options); 
    },
    put: async(endpoint: string, options = {}) => {
        await initValues();
        return api.put(endpoint, options);
    },
    patch: async(endpoint: string, options = {}) => {
        await initValues();
        return api.patch(endpoint, options);
    },
    delete: async(endpoint: string, data: Array<any>, options = {}) => {
        await initValues();
        var d = { data: data };
        return api.delete(endpoint, Object.assign({}, d), options);
    },
    options: async(endpoint: string, options: Array<any>) => {
        await initValues();
        return api.options(endpoint, options);
    },

    head: async(endpoint: string, options: Array<any>) => {
        await initValues();
        return api.head(endpoint, options);
    },
};

export default request;