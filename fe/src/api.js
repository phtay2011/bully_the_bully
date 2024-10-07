import axios from "axios";

const API_URL = "http://localhost:3001/api";

export const registerUser = async (username, email) => {
  const response = await axios.post(`${API_URL}/users`, { username, email });
  return response.data;
};

export const createProfile = async (name, category, image, createdBy) => {
  const response = await axios.post(`${API_URL}/profiles`, {
    name,
    category,
    image,
    createdBy,
  });
  return response.data;
};

export const getProfiles = async () => {
  const response = await axios.get(`${API_URL}/profiles`);
  return response.data;
};

export const addInformation = async (profileId, content, addedBy) => {
  const response = await axios.post(`${API_URL}/information`, {
    profileId,
    content,
    addedBy,
  });
  return response.data;
};

export const getInformation = async (profileId) => {
  const response = await axios.get(`${API_URL}/information/${profileId}`);
  return response.data;
};

export const upvoteInformation = async (id) => {
  const response = await axios.put(`${API_URL}/information/${id}/upvote`);
  return response.data;
};

export const rateProfile = async (profileId, rating, userId) => {
  const response = await axios.post(`${API_URL}/ratings`, {
    profileId,
    rating,
    userId,
  });
  return response.data;
};
