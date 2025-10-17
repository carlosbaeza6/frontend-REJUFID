<script setup>
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
</script>

<template>
  <!-- Notificaciones y confirmaciones visibles en toda la app -->
  <Toast />
  <ConfirmDialog />

  <!-- Aquí se renderiza cada vista -->
  <router-view />
</template>

<style scoped></style>
