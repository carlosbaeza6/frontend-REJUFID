<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const model = ref([
  {
    items: [
      { label: 'Gestión de Folders', icon: 'pi pi-fw pi-folder', to: '/expedientes' },
      { label: 'Verificación de documentos', icon: 'pi pi-fw pi-shield', to: '/verificacion' },
      { label: 'Gestión de Usuarios', icon: 'pi pi-fw pi-user', to: '/usuarios' }
    ]
  }
])
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="i">
      <app-menu-item v-if="!item.separator" :item="item" :index="i" />
      <li v-else class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
