<script setup>
import { useAccionesUsuario } from "@/composables/useAccionesUsuario";
import { useUsuarios } from "@/composables/UseUsuarios";
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Toast from "primevue/toast";
import FormularioUsuario from "./FormularioUsuario.vue";

const {
  loading,
  usuarios,
  rolesOptions,
  estadoOptions,
  filtros,
  aplicarFiltros,
  cargarUsuarios,
} = useUsuarios();

const {
  mostrarDialogo,
  modo,
  form,
  errores,
  usuarioSel,
  abrirCrear,
  abrirEditar,
  abrirVer,
  cerrarDialogo,
  guardar,
  eliminar,
} = useAccionesUsuario({ recargar: cargarUsuarios });

const buscar = () => aplicarFiltros();
</script>

<template>
  <div class="p-6">
    <Toast />

    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Usuarios</h1>
      <button
        @click="abrirCrear"
        class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
      >
        <i class="pi pi-plus"></i> Nuevo Usuario
      </button>
    </div>

    <!-- Filtros -->
    <div class="p-4 mb-6 border rounded-md shadow-sm bg-white">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <label>Rol</label>
          <Dropdown v-model="filtros.rolId" :options="rolesOptions" optionLabel="label" optionValue="value"
                    placeholder="Selecciona" class="w-full" showClear />
        </div>
        <div class="md:col-span-2">
          <label>Palabra clave</label>
          <InputText v-model="filtros.palabraClave" placeholder="Ej. nombre o correo" class="w-full" />
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <Button
          label="Buscar"
          icon="pi pi-search"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          :loading="loading"
          @click="buscar"
        />
      </div>
    </div>

    <!-- Tabla -->
    <DataTable
      :value="usuarios"
      :paginator="true"
      :rows="20"
      scrollable
      scrollHeight="400px"
      responsiveLayout="scroll"
      class="mt-4"
      stripedRows
      showGridlines
      paginatorTemplate="PrevPageLink PageLinks NextPageLink"
      :loading="loading"
      emptyMessage="No se encontraron usuarios."
    >
      <Column field="nombre" header="Nombre" />
      <Column field="correo" header="Correo" />
      <Column field="rol" header="Rol" />
      <Column header="Fecha registro">
        <template #body="{ data }">
          {{ (data.fechaRegistro ?? '').toString().split('T')[0] }}
        </template>
      </Column>
      <Column header="Acciones" bodyStyle="text-align:center">
        <template #body="{ data }">
          <div class="flex gap-2 justify-center">
            <Button icon="pi pi-eye"  @click="abrirVer(data)" v-tooltip.bottom="'Ver detalle'" />
            <Button icon="pi pi-pencil" class="!bg-amber-500 !hover:bg-amber-600 text-white rounded p-2"
                    @click="abrirEditar(data)" v-tooltip.bottom="'Editar'" />
            <Button icon="pi pi-trash" class="!bg-red-500 !hover:bg-red-600 text-white rounded p-2"
                    @click="eliminar(data)" v-tooltip.bottom="'Eliminar'" />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Diálogo Crear/Editar/Ver -->
    <Dialog v-model:visible="mostrarDialogo"
            :header="modo==='crear' ? 'Nuevo Usuario' : (modo==='editar' ? 'Editar Usuario' : 'Detalle de Usuario')"
            modal :style="{ width: '700px', maxHeight: '90vh' }" class="p-fluid">
      <template v-if="modo==='ver'">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Nombre</label>
            <InputText :value="usuarioSel?.nombre" readonly class="w-full" />
          </div>
          <div>
            <label>Correo</label>
            <InputText :value="usuarioSel?.correo" readonly class="w-full" />
          </div>
          <div>
            <label>Rol</label>
            <InputText :value="usuarioSel?.rol" readonly class="w-full" />
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <Button label="Cerrar" class="p-button-text" @click="cerrarDialogo" />
        </div>
      </template>

      <template v-else>
        <FormularioUsuario
          :modo="modo"
          :form="form"
          :errores="errores"
          :rolesOptions="rolesOptions"
          @guardar="guardar"
          @cancelar="cerrarDialogo"
        />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
label { display:block; margin-bottom:.25rem; font-weight:600; }
</style>
