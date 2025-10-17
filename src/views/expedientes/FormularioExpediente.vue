<template>
  <form @submit.prevent="$emit('guardar')">
    <div class="form-expediente grid grid-cols-2 gap-4 p-fluid">
      <div class="col-span-2">
        <label>Referencia</label>
        <InputText v-model="formulario.numero_expediente" class="w-full" placeholder="Ejemplo: 001/2025" />
        <Message v-if="errores.numero_expediente" severity="error" class="mt-1">
          {{ errores.numero_expediente }}
        </Message>
      </div>

      <div>
        <label>Tipo de órgano</label>
        <Select
          v-model="formulario.id_tipo_organo"
          :options="tipoOrganos"
          optionLabel="tipo_organo"
          optionValue="id_tipo_organo"
          class="w-full"
          placeholder="Selecciona"
        />
        <Message v-if="errores.id_tipo_organo" severity="error" class="mt-1">
          {{ errores.id_tipo_organo }}
        </Message>
      </div>

      <div>
        <label>Materia</label>
        <Select
          v-model="formulario.id_materia"
          :options="materias"
          optionLabel="materias"
          optionValue="id_materia"
          class="w-full"
          placeholder="Selecciona"
        />
        <Message v-if="errores.id_materia" severity="error" class="mt-1">
          {{ errores.id_materia }}
        </Message>
      </div>

      <div>
        <label>Órgano</label>
        <Select
          v-model="formulario.id_organo"
          :options="organos"
          optionLabel="organos"
          optionValue="id_organo"
          class="w-full"
          placeholder="Selecciona"
          filter
        />
        <Message v-if="errores.id_organo" severity="error" class="mt-1">
          {{ errores.id_organo }}
        </Message>
      </div>

      <div>
        <label>Tipo de asunto</label>
        <Select
          v-model="formulario.id_tipo_asunto"
          :options="tipoAsunto"
          optionLabel="tipo_asunto"
          optionValue="id_tipo_asunto"
          class="w-full"
          placeholder="Selecciona"
        />
        <Message v-if="errores.id_tipo_asunto" severity="error" class="mt-1">
          {{ errores.id_tipo_asunto }}
        </Message>
      </div>

      <div class="col-span-2">
        <label>Observación</label>
        <Textarea
          v-model="formulario.observacion"
          autoResize
          class="w-full"
          rows="3"
        />
      </div>

      <!-- PASO 1: Documentos PDF -->
      <div v-if="paso === 1" class="col-span-2 mt-4">
        <label class="block mb-1 font-semibold">Documentos PDF</label>

        <!-- Zona Drag & Drop -->
        <div
          class="w-full border-2 border-dashed border-gray-400 rounded-xl p-6 text-center bg-gray-50 hover:bg-blue-50 transition-colors duration-200 relative"
          @drop.prevent="handleDrop"
          @dragover.prevent
        >
          <div class="flex flex-col items-center justify-center space-y-2">
            <i class="pi pi-file-pdf text-4xl text-blue-500"></i>
            <p class="text-sm text-gray-600">Arrastra aquí tus archivos PDF o haz clic para seleccionarlos</p>
            <button
              type="button"
              @click="$refs.inputFile.click()"
              class="text-blue-600 text-sm underline hover:text-blue-800"
            >
              Elegir archivos
            </button>
            <p v-if="archivos.length > 0" class="text-sm text-gray-700 font-medium">
              {{ archivos.length }} archivo(s) seleccionado(s)
            </p>
          </div>
          <input
            type="file"
            accept="application/pdf"
            multiple
            class="hidden"
            ref="inputFile"
            @change="onArchivosSeleccionados"
          />
        </div>

        <!-- Lista de archivos -->
        <div v-if="archivos.length > 0" class="mt-4 space-y-3">
          <div
            v-for="(archivo, index) in archivos"
            :key="index"
            class="flex items-start justify-between border border-gray-300 rounded-lg p-3 bg-white shadow-sm"
          >
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-800 truncate">{{ archivo.name }}</p>
              <Select
                v-model="tiposArchivo[index]"
                :options="tipos"
                optionLabel="nombre"
                optionValue="id"
                class="w-full mt-1"
                placeholder="Tipo de archivo"
              />
              <small v-if="tiposArchivo[index] === ''" class="text-red-500">* Tipo requerido</small>
            </div>
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-danger p-button-sm ml-3 mt-2"
              @click="eliminarArchivo(index)"
            />
          </div>
        </div>
      </div>

      <!-- PASO 2: Firma digital -->
      <div v-if="paso === 2" class="col-span-2 mt-6">
        <h3 class="font-semibold text-gray-800 mb-2">Firma Digital</h3>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label>Archivo .cer</label>
            <input
              type="file"
              accept=".cer"
              class="w-full border p-2 rounded"
              @change="onCertificadoSeleccionado"
            />
          </div>

          <div>
            <label>Archivo .key</label>
            <input
              type="file"
              accept=".key"
              class="w-full border p-2 rounded"
              @change="onLlaveSeleccionada"
            />
          </div>

          <div class="col-span-2">
            <label>Contraseña del certificado</label>
            <input
              type="password"
              class="w-full border p-2 rounded"
              :value="passwordCertificado"
              @input="$emit('update:passwordCertificado', $event.target.value)"
              placeholder="********"
            />
          </div>
        </div>
      </div>

      </div>

   <div class="flex justify-end mt-4 gap-2">
      <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="$emit('cancelar')" />

      <Button
        v-if="paso === 1"
        label="Siguiente"
        icon="pi pi-arrow-right"
        class="p-button-success"
        type="button"
        @click="$emit('siguiente')"
      />
      <Button
        v-else
        label="Guardar"
        icon="pi pi-check"
        class="p-button-success"
        type="submit"
      />
    </div>

  </form>
</template>

<script setup>
import { inject, ref } from 'vue';

const emit = defineEmits(['guardar', 'cancelar', 'siguiente']);
const props = defineProps({
  formulario: Object,
  errores: Object,
  archivos: Array,
  tiposArchivo: Array,
  onArchivosSeleccionados: Function,
  eliminarArchivo: Function,
  onCertificadoSeleccionado: Function,
  onLlaveSeleccionada: Function,
  passwordCertificado: String,
  paso: Number
});

const {
  materias,
  tipoOrganos,
  organos,
  tipoAsunto
} = inject('catalogosExpedientes') ?? {};

const tipos = [
  { id: 1, nombre: 'Original' },
  { id: 2, nombre: 'Copia certificada' },
  { id: 3, nombre: 'Copia simple' }
];

const inputFile = ref(null);

const handleDrop = (event) => {
  const droppedFiles = Array.from(event.dataTransfer.files).filter(
    (file) => file.type === 'application/pdf'
  );
  droppedFiles.forEach((file) => {
    props.archivos.push(file);
    props.tiposArchivo.push('');
  });
};
</script>