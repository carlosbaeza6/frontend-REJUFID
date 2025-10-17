import {
  getMaterias,
  getOrganos,
  getTipoAsunto,
  getTipoOrganos
} from '@/services/CatalogosService';
import { consultarExpedientes } from '@/services/ExpedientesService';
import { nextTick, onMounted, ref } from 'vue';

export function useExpedientes() {
  const expedientes = ref([]);
  const loading = ref(false);

  const materias = ref([]);
  const tipoOrganos = ref([]);
  const organos = ref([]);
  const tipoAsunto = ref([]);

  const filtros = ref({
    tipoOrgano: null,
    organo: null,
    materia: null,
    palabraClave: ''
  });

  const cargarDatos = async () => {
    loading.value = true;
    try {
      const [resExp, resMat, resTipoOrg, resOrg, resTipoAsunto] = await Promise.all([
        consultarExpedientes(),
        getMaterias(),
        getTipoOrganos(),
        getOrganos(),
        getTipoAsunto()
      ]);

      expedientes.value = resExp;
      materias.value = resMat.data;
      tipoOrganos.value = resTipoOrg.data;
      organos.value = resOrg.data;
      tipoAsunto.value = resTipoAsunto.data;
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      loading.value = false;
    }
  };

  const aplicarFiltros = async () => {
    loading.value = true;
    try {
      const { tipoOrgano, organo, materia, palabraClave } = filtros.value;

      const params = {
        ...(tipoOrgano && { tipoOrgano }),
        ...(organo && { organo }),
        ...(materia && { materia }),
        ...(palabraClave?.trim() && { palabraClave: palabraClave.trim() })
      };

      const data = await consultarExpedientes(params);
      expedientes.value = [];
      await nextTick();
      expedientes.value = [...data];
    } catch (err) {
      console.error('Error al aplicar filtros:', err);
    } finally {
      loading.value = false;
    }
  };

  onMounted(cargarDatos);

  return {
    expedientes,
    materias,
    tipoOrganos,
    organos,
    tipoAsunto,
    filtros,
    loading,
    cargarDatos,
    aplicarFiltros
  };
}
