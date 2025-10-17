<script setup>
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';

const props = defineProps({
  modo: { type: String, default: 'crear' },
  form: { type: Object, required: true },
  errores: { type: Object, default: () => ({}) },
  rolesOptions: { type: Array, default: () => [] },
});

defineEmits(['guardar', 'cancelar']);
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- ID de usuario -->
    <div>
      <label>ID de usuario</label>
      <InputText
        v-model="form.idUsuario"
        :readonly="props.modo === 'ver' || props.modo === 'editar'"
        class="w-full"
        placeholder="Ej. US0005"
      />
      <small v-if="errores.idUsuario" class="text-red-500">{{ errores.idUsuario }}</small>
    </div>

    <!-- Matrícula -->
    <div>
      <label>Matrícula</label>
      <InputText
        v-model="form.matricula"
        :readonly="props.modo === 'ver'"
        class="w-full"
        placeholder="Ej. A16040263"
      />
      <small v-if="errores.matricula" class="text-red-500">{{ errores.matricula }}</small>
    </div>

    <!-- Nombre -->
    <div>
      <label>Nombre</label>
      <InputText v-model="form.nombre" :readonly="props.modo === 'ver'" class="w-full" />
      <small v-if="errores.nombre" class="text-red-500">{{ errores.nombre }}</small>
    </div>

    <!-- Correo -->
    <div>
      <label>Correo</label>
      <InputText v-model="form.correo" :readonly="props.modo === 'ver'" class="w-full" />
      <small v-if="errores.correo" class="text-red-500">{{ errores.correo }}</small>
    </div>

    <!-- Rol -->
    <div class="md:col-span-2">
      <label>Rol</label>
      <Dropdown
        v-model="form.id_rol"
        :options="rolesOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Selecciona"
        class="w-full"
        :disabled="props.modo === 'ver'"
      />
      <small v-if="errores.id_rol" class="text-red-500">{{ errores.id_rol }}</small>
    </div>

    <!-- Contraseña -->
    <div class="col-span-2" v-if="props.modo === 'crear'">
      <label>Contraseña</label>
      <Password
        v-model="form.password"
        :feedback="false"
        toggleMask
        class="w-full"
        inputClass="w-full"
      />
      <small v-if="errores.password" class="text-red-500">{{ errores.password }}</small>
    </div>
  </div>

  <div class="mt-6 flex justify-end gap-2" v-if="props.modo !== 'ver'">
    <Button label="Cancelar" class="p-button-text" @click="$emit('cancelar')" />
    <Button label="Guardar" icon="pi pi-save" @click="$emit('guardar')" />
  </div>
</template>

<style scoped>
label { display:block; margin-bottom:.25rem; font-weight:600; }
</style>
