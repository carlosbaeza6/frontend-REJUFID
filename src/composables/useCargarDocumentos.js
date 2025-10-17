import { uploadMultipleDocuments } from '@/services/DocumentosService';
import { ref } from 'vue';

export function useCargarDocumentos() {
    const cargando = ref(false);
    const error = ref(null);
    const exito = ref(false);

    const cargarDocumentos = async ({
        idExpediente,
        usuario,
        archivos,
        tiposArchivo,
        certificadoCer,
        llaveKey,
        passwordCertificado
    }) => {
        cargando.value = true;
        error.value = null;
        exito.value = false;

        try {
            const formData = new FormData();
            formData.append('Id_expediente', idExpediente);
            formData.append('Usuario_carga', usuario);

            archivos.forEach((archivo) => {
                formData.append('Archivos', archivo);
            });

            tiposArchivo.forEach((tipo) => {
                formData.append('TiposArchivo', tipo);
            });

            // Firma digital
            formData.append('CertificadoCer', certificadoCer);
            formData.append('LlaveKey', llaveKey);
            formData.append('PasswordCertificado', passwordCertificado);

            await uploadMultipleDocuments(formData);
            exito.value = true;
        } catch (err) {
            error.value = err.response?.data || 'Error al subir documentos.';
            console.error('Error al subir documentos:', err);
        } finally {
            cargando.value = false;
        }
    };

    return {
        cargarDocumentos,
        cargando,
        error,
        exito,
    };
}
