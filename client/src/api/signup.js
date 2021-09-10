import axios from 'axios';
const baseUrl = 'http://localhost:3001';

export const createAccount = async (credentials) => {
  const response = await axios.post(`${baseUrl}/api/users`, credentials);
  return response.data;
};
