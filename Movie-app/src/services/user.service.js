import axios from 'axios';
import AuthService from './auth.service.jsx';

// Get the base API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL + 'watchlist/';

// Helper function to get the auth header with the JWT token
const authHeader = () => {
  const user = AuthService.getCurrentUser();
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

// --- Watchlist API Functions ---

const getWatchlist = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const addToWatchlist = (itemId, itemType) => {
  return axios.post(API_URL, { itemId, itemType }, { headers: authHeader() });
};

const removeFromWatchlist = (itemId, itemType) => {
  return axios.delete(API_URL + `${itemType}/${itemId}`, { headers: authHeader() });
};

const UserService = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
};

export default UserService;