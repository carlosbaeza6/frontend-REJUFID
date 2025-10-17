import { useNotificaciones } from '@/composables/useNotificaciones';
import { getPdfByExpediente } from '@/services/DocumentosService';
import { deleteExpediente } from '@/services/ExpedientesService';

import { useConfirm } from 'primevue/useconfirm';
import { ref } from 'vue';

export function useAccionesExpediente({ cargarDatos }) {
  const { mostrarExito, mostrarError } = useNotificaciones();
  const confirm = useConfirm();

  const mostrarDialogoVisualizar = ref(false);
  const expedienteSeleccionado = ref(null);
  const documentosRelacionados = ref([]);

  async function verExpediente(expediente) {
    expedienteSeleccionado.value = expediente;
    mostrarDialogoVisualizar.value = true;

    try {
      documentosRelacionados.value = await getPdfByExpediente(expediente.id_expediente);
    } catch (error) {
      console.error('Error al obtener documentos relacionados:', error);
      documentosRelacionados.value = [];
    }
  }

  function abrirDocumento(doc) {
    const backendURL = 'https://localhost:7218';
    const ruta = doc.ruta_archivo.startsWith('/') ? doc.ruta_archivo : `/${doc.ruta_archivo}`;
    const url = `${backendURL}${ruta}`;
    console.log('Abriendo documento:', url);
    window.open(url, '_blank');
  }

  function cerrarDialogoVisualizar() {
    mostrarDialogoVisualizar.value = false;
    expedienteSeleccionado.value = null;
    documentosRelacionados.value = [];
  }

  function eliminarExpediente(expediente) {
    confirm.require({
      message: `¿Estás seguro de que deseas eliminar el expediente ${expediente.numero_expediente}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptClass: 'p-button-danger',
      accept: async () => {
        try {
          await deleteExpediente(expediente.id_expediente);
          await cargarDatos();
          mostrarExito('Expediente eliminado correctamente.');
        } catch (error) {
          console.error(error);
          mostrarError('Error al eliminar el expediente.');
        }
      }
    });
  }

  return {
    // Visualización
    expedienteSeleccionado,
    mostrarDialogoVisualizar,
    verExpediente,
    abrirDocumento,
    cerrarDialogoVisualizar,
    documentosRelacionados,

    // Eliminación
    eliminarExpediente
  };
}
