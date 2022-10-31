import axios from "axios";
require('dotenv').config();

export default axios.create({
  baseURL: process.env.BACKEND_URL || 'http://localhost:8080/api'
});