import api from './axios';

export const getUsuarios = (params = {}) =>
  api.get('/UsuarioRol', { params }).then(res => res.data);
export const getUsuarioById = (id) =>
  api.get(`/UsuarioRol/${id}`).then(res => res.data);
export const getUsuarioByCorreo = (correo) =>
  api.get('/UsuarioRol/correo', { params: { correo } }).then(res => res.data);
export const createUsuario = (payload) =>
  api.post('/UsuarioRol', payload).then(res => res.data);
export const updateUsuario = (id, payload) =>
  api.put(`/UsuarioRol/${id}`, payload);
export const deleteUsuario = (id) =>
  api.delete(`/UsuarioRol/${id}`);
