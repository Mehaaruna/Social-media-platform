import axios from 'axios';

const API_URL = "http://localhost:5000";

export const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};

export const register = async (credentials) => {
    const response = await axios.post(`${API_URL}/register`, credentials);
    return response.data;
};

export const uploadPost = async (postData) => {
    const response = await axios.post(`${API_URL}/upload`, postData);
    return response.data;
};

export const getAllPosts = async () => {
    const response = await axios.get(`${API_URL}/posts`);
    return response.data;
};

export const getUserPosts = async (userId) => {
    const response = await axios.get(`${API_URL}/profile/${userId}`);
    return response.data;
};