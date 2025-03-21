import axios from "axios";

const API_URL = "http://localhost:5001/api"; // Backend URL

export const registerUser = (userData) => axios.post(`${API_URL}/users/register`, userData);
export const loginUser = (userData) => axios.post(`${API_URL}/users/login`, userData);
export const fetchServices = () => axios.get(`${API_URL}/services`);
export const createService = (serviceData) => axios.post(`${API_URL}/services`, serviceData);
export const sendTransaction = (transactionData) => axios.post(`${API_URL}/transactions`, transactionData);
export const fetchTransactions = (userId) => axios.get(`${API_URL}/transactions/user/${userId}`);
export const submitReview = (reviewData) => axios.post(`${API_URL}/reviews`, reviewData);
export const fetchReviews = (serviceId) => axios.get(`${API_URL}/reviews/service/${serviceId}`);
