import api from './axios';
export const getMaterias = () => api.get('/api/Catalogos/materias');
export const getEstados = () => api.get('/api/Catalogos/estados');
export const getTipoOrganos = () => api.get('/api/Catalogos/tipo_organo');
export const getOrganos = () => api.get('/api/Catalogos/organos');
export const getTipoAsunto = () => api.get('/api/Catalogos/tipo_asunto');

