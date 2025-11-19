let API_URL = process.env.REACT_APP_API_URL;

// Fallback para desarrollo
if (!API_URL) {
  API_URL = "http://localhost:10000"; 
}

export default API_URL;