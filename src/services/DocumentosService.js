import axios from './axios';

export const uploadMultipleDocuments = async (formData) => {
  const { data } = await axios.post('/api/Documento/upload-multiple', formData);
  return data;
};

export const getPdfByExpediente = async (idExpediente) => {
  const { data } = await axios.get(`/api/Documento/${idExpediente}`);
  return data;
};

export const verifyDocumento = async (file) => {
  const fd = new FormData();
  fd.append('archivo', file); 
  const { data } = await axios.post('/api/Documento/verificar', fd);
  return data;
};
