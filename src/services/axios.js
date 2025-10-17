import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7218',
});

api.defaults.headers.common['Accept'] = 'application/json';

api.interceptors.request.use((config) => {
  const h = config.headers || {};

  if (config.data instanceof FormData) {
    delete h['Content-Type'];
    delete h['content-type'];
  } else {
    
    if (!h['Content-Type'] && !h['content-type']) {
      h['Content-Type'] = 'application/json';
    }
  }

  config.headers = h;
  return config;
});

export default api;
