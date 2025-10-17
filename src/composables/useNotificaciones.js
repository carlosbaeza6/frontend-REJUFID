import { useToast } from 'primevue/usetoast';

export function useNotificaciones() {
  const toast = useToast();

  function mostrarExito(detalle = 'Acción realizada correctamente') {
    toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: detalle,
      life: 3000
    });
  }

  function mostrarError(detalle = 'Ocurrió un error') {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: detalle,
      life: 3000
    });
  }

  return {
    mostrarExito,
    mostrarError
  };
}
