import axios from "axios"
import AxiosMockAdapter from 'axios-mock-adapter'

// all WEB traffic using this API instance
const instance = axios.create({
    baseURL: "https://44t9tko9kd.execute-api.us-east-1.amazonaws.com/prod/"
});

const mock = new AxiosMockAdapter(instance, { onNoMatch: "passthrough" });

export { instance, mock }