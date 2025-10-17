<template>
  <div class="p-6">
    <Toast />

    <!-- Header y botón de Nuevo Expediente -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Folders</h1>
      <button
        @click="abrirFormulario"
        class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
      >
        <i class="pi pi-plus"></i> Nuevo Folder
      </button>
    </div>

    <!-- Área de filtros -->
    <div class="p-4 mb-6 border rounded-md shadow-sm bg-white">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
      
        <div>
          <label>Materia</label>
          <Select
            v-model="filtros.materia"
            :options="materias"
            optionLabel="materias"
            optionValue="materias"
            placeholder="Selecciona"
            class="w-full"
            showClear
          />
        </div>

        <div>
          <label>Tipo de órgano</label>
          <Select
            v-model="filtros.tipoOrgano"
            :options="tipoOrganos"
            optionLabel="tipo_organo"
            optionValue="tipo_organo"
            placeholder="Selecciona"
            class="w-full"
            showClear
          />
        </div>

        <div>
          <label>Órgano</label>
          <Select
            v-model="filtros.organo"
            :options="organos"
            optionLabel="organos"
            optionValue="organos"
            placeholder="Selecciona"
            class="w-full"
            showClear
            filter
          />
        </div>

        <div>
          <label for="palabraClave">Palabra Clave</label>
          <InputText
            id="palabraClave"
            name="palabraClave"
            v-model="filtros.palabraClave"
            placeholder="Ej. Referencia"
            class="w-full"
          />
        </div>
      </div>

    <div class="mt-4 flex justify-end">
      <Button
        label="Buscar"
        icon="pi pi-search"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        :loading="loading"
        @click="aplicarFiltros"
      />
    </div>
  </div>

    <DataTable
      :value="expedientes"
      :paginator="true"
      :rows="20"
      scrollable
      scrollHeight="400px"
      responsiveLayout="scroll"
      class="tabla-expedientes mt-4"
      stripedRows
      showGridlines
      paginatorTemplate="PrevPageLink PageLinks NextPageLink"
      emptyMessage="No se encontraron folders."
    >
      <!-- Tabla de folders (antes expedientes) -->
      <Column field="numero_expediente" header="Referencia" />
      <Column header="Fecha">
        <template #body="slotProps">
          {{ slotProps.data.fecha_expediente?.split('T')[0] }}
        </template>
      </Column>
      <Column field="tipo_organo" header="Tipo de órgano" />
      <Column field="organo" header="Órgano" />
      <Column field="materia" header="Materia" />
      <Column field="observacion" header="Observación" />
      <Column header="Acciones" bodyStyle="text-align: center;">
        <template #body="slotProps">
          <div class="flex gap-2 justify-center">
            <Button 
              icon="pi pi-eye" 
              class="" 
              @click="verExpediente(slotProps.data)" 
              v-tooltip.bottom="'Visualizar'" 
            />
            <Button 
              icon="pi pi-trash"
              class="!bg-red-500 !hover:bg-red-600 text-white rounded p-2"
              @click="eliminarExpediente(slotProps.data)"
              v-tooltip.bottom="'Eliminar'"
            />
          </div>
        </template>
      </Column>
    </DataTable>


    <!-- Dialogo para nuevo expediente -->
    <Dialog v-if="mostrarFormulario" v-model:visible="mostrarFormulario" header="Nuevo Folder" modal :style="{ width: '900px', maxHeight: '90vh' }" class="p-fluid">
      <FormularioExpediente
        :formulario="formularioCrear"
        :errores="erroresCrear"
        :archivos="archivos"
        :tiposArchivo="tiposArchivo"
        :onArchivosSeleccionados="onArchivosSeleccionados"
        :eliminarArchivo="eliminarArchivo"
        :certificadoCer="certificadoCer"
        :llaveKey="llaveKey"
        :passwordCertificado="passwordCertificado"
        :onCertificadoSeleccionado="onCertificadoSeleccionado"
        :onLlaveSeleccionada="onLlaveSeleccionada"
        @update:passwordCertificado="val => passwordCertificado = val"
        :paso="paso"
        @siguiente="siguientePaso"
        @guardar="guardarFormulario"
        @cancelar="cerrarFormulario"
      />
    </Dialog>
  </div>

  <!-- Dialogo para visualizar expedientes -->
  <Dialog 
    header="Detalle del Folder" 
    v-model:visible="mostrarDialogoVisualizar" 
    modal 
    :style="{ width: '900px', maxHeight: '90vh' }"
    class="p-fluid"
    @hide="cerrarDialogoVisualizar"
  >
    <div v-if="expedienteSeleccionado" class="form-expediente grid grid-cols-2 gap-4">
      <div class="col-span-2">
        <label>Referencia</label>
        <InputText :value="expedienteSeleccionado.numero_expediente" readonly class="w-full"/>
      </div>
      <div>
        <label>Estado</label>
        <InputText :value="expedienteSeleccionado.estado" readonly class="w-full"/>
      </div>
      
      <div>
        <label>Tipo de Órgano</label>
        <InputText :value="expedienteSeleccionado.tipo_organo" readonly class="w-full"/>
      </div>
      <div>
        <label>Materia</label>
        <InputText :value="expedienteSeleccionado.materia" readonly class="w-full"/>
      </div>

      <div>
        <label>Órgano</label>
        <InputText :value="expedienteSeleccionado.organo" readonly class="w-full"/>
      </div>

      <div>
        <label>Tipo de Asunto</label>
        <InputText :value="expedienteSeleccionado.tipo_asunto" readonly class="w-full"/>
      </div>

      <div class="col-span-2">
        <label>Observación</label>
        <Textarea :value="expedienteSeleccionado.observacion" autoResize readonly rows="3" class="w-full"/>
      </div>
      <div v-for="(doc, i) in documentosRelacionados" :key="i" class="flex justify-between items-center mb-3">
      <div class="flex items-center gap-2">
        <i class="pi pi-file" style="font-size: 1.5rem;"></i>
        <div>
          <div class="font-semibold">{{ doc.nombre_archivo }}</div>
          <div class="text-xs text-gray-500">{{ getTipoArchivo(doc.id_tipo_archivo) }}</div>
        </div>
      </div>
      <Button
        label="Ver"
        icon="pi pi-eye"
        class="p-button-sm p-button-outlined p-button-success"
        @click="() =>abrirDocumento(doc)"
      />
</div>

    </div>
  </Dialog>
</template>

<script setup>
import { useAccionesExpediente } from '@/composables/useAccionesExpediente';
import { useCrearExpediente } from '@/composables/useCrearExpediente';
import { useExpedientes } from '@/composables/useExpedientes';
import { Select } from 'primevue';
import { provide, ref } from 'vue';
import FormularioExpediente from './FormularioExpediente.vue';

const loading = ref(false);

const tiposArchivoMap = {
  1: 'Original',
  2: 'Copia certificada',
  3: 'Copia simple'
};

function getTipoArchivo(id) {
  return tiposArchivoMap[id] || 'Sin tipo';
}
function siguientePaso() {
  if (!validarFormulario()) return;
  if (!validarPaso1()) return;
  paso.value = 2;
}


const {
  expedientes, materias, tipoOrganos,
  organos, tipoAsunto, filtros, cargarDatos, aplicarFiltros
} = useExpedientes();

provide('catalogosExpedientes', {
  materias,
  tipoOrganos,
  organos,
  tipoAsunto
});

const {
  mostrarFormulario, 
  formulario: formularioCrear,
  errores: erroresCrear,
  archivos,
  tiposArchivo,
  onArchivosSeleccionados,
  eliminarArchivo, 
  abrirFormulario, 
  cerrarFormulario, 
  guardarFormulario,
  certificadoCer,
  llaveKey,
  passwordCertificado,
  onCertificadoSeleccionado,
  onLlaveSeleccionada,
  validarFormulario,
  paso,       
  validarPaso1             
} = useCrearExpediente({ cargarDatos });

const {
  mostrarDialogoEditar,
  formulario: formularioEditar,
  errores: erroresEditar, 
  mostrarDialogoVisualizar,
  expedienteSeleccionado,
  documentosRelacionados, 
  abrirEditor, 
  cerrarEditor,
  guardarEdicion, 
  verExpediente,
  abrirDocumento, 
  cerrarDialogoVisualizar,
  eliminarExpediente
} = useAccionesExpediente({ cargarDatos });
</script>