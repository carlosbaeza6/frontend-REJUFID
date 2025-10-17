<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const checked = ref(false);
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-[#006750] flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, #006750 10%, rgba(0, 103, 80, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <img src="/logo-rejufid.png" alt="REJUFID Logo" class="mb-8 w-24 mx-auto" />
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Bienvenido a REJUFID</div>
                        <span class="text-muted-color font-medium">Inicia Sesión</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Correo Electrónico</label>
                        <InputText id="email1" type="text" placeholder="example@imss.gob.mx" class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contrseña</label>
                        <Password id="password1" v-model="password" placeholder="********" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>
                        <Button label="Iniciar Sesion" class="w-full" as="router-link" to="/"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
