const API_URL = import.meta.env.VITE_API_URL;

export const endpoints = {
  login: `${API_URL}/api/auth/login`,
  register: `${API_URL}/api/auth/register`,
  verifyOTP: `${API_URL}/api/auth/verify-otp`,
  comments: `${API_URL}/api/comments`,
  profile: (id) => `${API_URL}/api/users/${id}`
};
