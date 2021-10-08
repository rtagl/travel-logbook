import axios from 'axios';
const API_URL = '/api/logs';

let token = null;

export const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

export const getAll = async () => {
  const response = await axios.get(`${API_URL}`);
  return response.data;
};

export const createEntry = async (newEntry) => {
  const response = await axios.post(`${API_URL}`, newEntry, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });
  return response.data;
};

export const deleteEntry = async (entryId) => {
  const response = await fetch(`${API_URL}/${entryId}`, {
    method: 'DELETE',
  });
  return response.json();
};
