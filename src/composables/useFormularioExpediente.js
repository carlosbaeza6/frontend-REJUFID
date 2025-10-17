import { ref } from 'vue';

export function useFormularioExpediente() {
  const errores = ref({});

  const formulario = ref({
    numero_expediente: '',
    id_tipo_organo: null,
    id_materia: null,
    id_organo: null,
    id_tipo_asunto: null,
    observacion: ''
  });

  function resetFormulario() {
    formulario.value = {
      numero_expediente: '',
      id_tipo_organo: null,
      id_materia: null,
      id_organo: null,
      id_tipo_asunto: null,
      observacion: ''
    };
  }

  function validarFormulario() {
    const camposRequeridos = [
      'numero_expediente',
      'id_tipo_organo',
      'id_materia',
      'id_organo',
      'id_tipo_asunto'
    ];

    errores.value = {};
    camposRequeridos.forEach(campo => {
      if (!formulario.value[campo]) {
        errores.value[campo] = 'Este campo es obligatorio.';
      }
    });

    return Object.keys(errores.value).length === 0;
  }

  return {
    formulario,
    errores,
    resetFormulario,
    validarFormulario
  };
}
