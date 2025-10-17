<script setup>
import { useLayout } from '@/layout/composables/layout';
// AppConfigurator eliminado
const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <img :src="isDarkTheme ? '/logo-rejufid-white.png' : '/logo-rejufid.png'" alt="REJUFID Logo" style="height: 2rem; margin-right: 0.5rem;" />
                <span>REJUFID</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <!-- Botón de modo claro/oscuro -->
            <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
            </button>

            <!-- Botón de menú responsive -->
            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <!-- Solo ícono de usuario -->
            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-user"></i>
                        <span>Perfil</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
