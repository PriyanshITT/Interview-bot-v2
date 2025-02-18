import axios from "axios";

const API_URL = 'https://interviewbot.intraintech.com/api';

const getToken = () => {
  return localStorage.getItem('token');
};

const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signin`, { username, password });
    console.log(response.data)
    if (response.data.token) {
      console.log(response.data.id)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user_id', response.data.id);

    }
    return response.data;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem('token');
};

const makeAuthenticatedRequest = async (endpoint) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Authenticated request failed', error);
    throw error;
  }
};

export { login, logout, makeAuthenticatedRequest };
