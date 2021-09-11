import axios from 'axios';
const baseUrl = 'http://localhost:3001';

const createAccount = async (credentials) => {
  const response = await axios.post(`${baseUrl}/api/users`, credentials);
  return response.data;
};

const signUpService = {
  createAccount,
};

export default signUpService;
