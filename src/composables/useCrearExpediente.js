import { useCargarDocumentos } from '@/composables/useCargarDocumentos';
import { useFormularioExpediente } from '@/composables/useFormularioExpediente';
import { useNotificaciones } from '@/composables/useNotificaciones';
import { createExpediente, deleteExpediente } from '@/services/ExpedientesService';
import { ref } from 'vue';

export function useCrearExpediente({ cargarDatos }) {
  const mostrarFormulario = ref(false);

  const {
    formulario: formularioCrear,
    errores: erroresCrear,
    resetFormulario,
    validarFormulario
  } = useFormularioExpediente();

  const { mostrarExito, mostrarError } = useNotificaciones();
  const { cargarDocumentos, cargando, error: errorCarga } = useCargarDocumentos();

  const archivos = ref([]);
  const tiposArchivo = ref([]);

  // Firma digital
  const certificadoCer = ref(null);
  const llaveKey = ref(null);
  const passwordCertificado = ref('');

  // Paso del formulario (1 = documentos, 2 = firma)
  const paso = ref(1);

  // MÉTODOS DE ARCHIVOS
  function onArchivosSeleccionados(event) {
    const nuevos = Array.from(event.target.files);
    nuevos.forEach((archivo) => {
      archivos.value.push(archivo);
      tiposArchivo.value.push('');
    });
  }

  function eliminarArchivo(index) {
    archivos.value.splice(index, 1);
    tiposArchivo.value.splice(index, 1);
  }

  function onCertificadoSeleccionado(event) {
    certificadoCer.value = event.target.files[0];
  }

  function onLlaveSeleccionada(event) {
    llaveKey.value = event.target.files[0];
  }

  // VALIDACIÓN DE DOCUMENTOS (paso 1)
  function validarPaso1() {
    if (!archivos.value || archivos.value.length === 0) {
      mostrarError('Debes subir al menos un documento PDF para continuar.');
      return false;
    }

    const sonPDF = archivos.value.every(file => file.type === 'application/pdf');
    if (!sonPDF) {
      mostrarError('Solo se permiten archivos en formato PDF.');
      return false;
    }

    const tiposValidos =
      archivos.value.length === tiposArchivo.value.length &&
      tiposArchivo.value.every(tipo => tipo !== '' && tipo !== null && tipo !== undefined);

    if (!tiposValidos) {
      mostrarError('Todos los documentos deben tener un tipo de archivo asignado.');
      return false;
    }

    const limitePorArchivo = 30 * 1024 * 1024;
    const archivoGrande = archivos.value.find(file => file.size > limitePorArchivo);
    if (archivoGrande) {
      mostrarError(`El archivo "${archivoGrande.name}" supera el límite de 30MB.`);
      return false;
    }

    const totalSize = archivos.value.reduce((acc, f) => acc + f.size, 0);
    const limiteTotal = 100 * 1024 * 1024;
    if (totalSize > limiteTotal) {
      mostrarError('El tamaño total de los archivos supera el límite permitido de 100MB.');
      return false;
    }

    const tieneOriginal = tiposArchivo.value.includes(1);
    if (!tieneOriginal) {
      mostrarError('Debe existir al menos un documento con tipo "Original" para continuar.');
      return false;
    }

    return true;
  }

  // VALIDACIÓN DE FIRMA (solo si hay un "Original")
  function validarArchivos() {
    if (!validarPaso1()) return false;

    const requiereFirma = tiposArchivo.value.includes(1);
    if (
      requiereFirma &&
      (!certificadoCer.value || !llaveKey.value || !passwordCertificado.value)
    ) {
      mostrarError('Debes proporcionar el certificado, la llave y la contraseña para firmar los documentos.');
      return false;
    }

    return true;
  }

  // FLUJO PRINCIPAL
  function abrirFormulario() {
    resetFormulario();
    erroresCrear.value = {};
    mostrarFormulario.value = true;
    paso.value = 1;
  }

  function cerrarFormulario() {
    mostrarFormulario.value = false;
    resetFormulario();
    erroresCrear.value = {};
    archivos.value = [];
    tiposArchivo.value = [];
    certificadoCer.value = null;
    llaveKey.value = null;
    passwordCertificado.value = '';
    paso.value = 1;
  }

  async function guardarFormulario() {
    if (!validarFormulario()) return;
    if (!validarArchivos()) return;

    const fechaActual = new Date();
    const payload = {
      ...formularioCrear.value,
      id_estado: 1,
      fecha_expediente: fechaActual.toISOString(),
      anio_expediente: fechaActual.getFullYear(),
      fecha_registro: fechaActual.toISOString(),
      id_estatus: 1,
      usuario_registro: 'admin'
    };

    let expedienteCreado = null;

    try {
      // Crear expediente
      expedienteCreado = await createExpediente(payload);

      // Subir/firmar documentos
      errorCarga.value = null;

      await cargarDocumentos({
        idExpediente: expedienteCreado.id_expediente,
        usuario: 'admin',
        archivos: archivos.value,
        tiposArchivo: tiposArchivo.value,
        certificadoCer: certificadoCer.value,
        llaveKey: llaveKey.value,
        passwordCertificado: passwordCertificado.value
      });

      if (errorCarga.value) {
        try {
          await deleteExpediente(expedienteCreado.id_expediente);
        } catch (eRollback) {
          console.error('Error al revertir expediente tras fallo de carga:', eRollback);
        }
        mostrarError('Ocurrió un error al subir/firmar los documentos. No se creó el expediente.');
        return;
      }

      await cargarDatos();
      cerrarFormulario();
      mostrarExito('Expediente creado exitosamente.');
    } catch (error) {
      console.error('Error al guardar expediente:', error);

      // Rollback si el expediente ya se había creado
      if (expedienteCreado?.id_expediente) {
        try {
          await deleteExpediente(expedienteCreado.id_expediente);
        } catch (eRollback) {
          console.error('Error al revertir expediente tras excepción:', eRollback);
        }
      }

      const mensaje = error?.response?.data;
      const textoError =
        typeof mensaje === 'string'
          ? mensaje
          : mensaje?.message || mensaje?.title || JSON.stringify(mensaje);

      if (textoError?.includes?.('Ya existe un expediente con ese número')) {
        erroresCrear.value.numero_expediente = 'Ya existe una referencia igual para ese órgano.';
      } else {
        mostrarError('Error al crear expediente.');
      }
    }
  }

  return {
    mostrarFormulario,
    formulario: formularioCrear,
    errores: erroresCrear,
    abrirFormulario,
    cerrarFormulario,
    guardarFormulario,
    archivos,
    tiposArchivo,
    certificadoCer,
    llaveKey,
    passwordCertificado,
    cargando,
    paso,
    onArchivosSeleccionados,
    eliminarArchivo,
    onCertificadoSeleccionado,
    onLlaveSeleccionada,
    validarPaso1,
    validarFormulario
  };
}