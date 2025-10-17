import { useNotificaciones } from '@/composables/useNotificaciones'
import { verifyDocumento } from '@/services/DocumentosService'
import { computed, ref } from 'vue'

export function useVerificarDocumento() {
  const archivo = ref(null)
  const resultado = ref(null)
  const cargando = ref(false)
  const error = ref('')

  const { mostrarExito, mostrarError } = useNotificaciones()

  function setFile(file) {
    error.value = ''
    resultado.value = null
    if (!file) {
      archivo.value = null
      return
    }
    const esPdf =
      file.type === 'application/pdf' ||
      /\.pdf$/i.test(file.name || '')
    if (!esPdf) {
      archivo.value = null
      error.value = 'Sólo se permiten archivos PDF.'
      return
    }
    archivo.value = file
  }

  function onFileChange(e) {
    setFile(e.target?.files?.[0] || null)
  }

  function limpiar() {
    archivo.value = null
    resultado.value = null
    error.value = ''
    const input = document.getElementById('input-pdf')
    if (input) input.value = ''
  }

  const puedeVerificar = computed(() => !!archivo.value && !cargando.value)

  async function verificar() {
    if (!archivo.value) {
      error.value = 'Selecciona un PDF primero.'
      return
    }
    cargando.value = true
    error.value = ''
    resultado.value = null
    try {
      const data = await verifyDocumento(archivo.value)
      resultado.value = data
      if (data?.valido) {
        mostrarExito('Documento válido y firmado.')
      } else {
        mostrarError(data?.mensaje || 'No se pudo validar el documento.')
      }
    } catch (e) {
      console.error(e)
      error.value = 'No se pudo verificar el documento.'
      mostrarError(error.value)
    } finally {
      cargando.value = false
    }
  }

  return {
    archivo,
    resultado,
    cargando,
    error,
    puedeVerificar,
    setFile,
    onFileChange,
    verificar,
    limpiar
  }
}
