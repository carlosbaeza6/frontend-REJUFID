import api from './axios';

export const getExpedientes = () => api.get('/Expedientes'); 
export const consultarExpedientes = (params = {}) =>
    api.get('/Expedientes/Filtros', { params }).then(res => res.data);  
export const createExpediente = (payload) =>
    api.post('/Expedientes', payload).then(res => res.data);
export const updateExpediente = (id, expediente) =>
    api.put(`/Expedientes/${id}`, expediente);
export const deleteExpediente = (id) =>
    api.delete(`/Expedientes/${id}`);
  
  
