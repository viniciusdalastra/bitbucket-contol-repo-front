<script setup lang="ts">

import { useLoginStore } from '@/stores/login';
import RepositoryListComponent from './repository/RepositoryListComponent.vue';
import LoginComponent from './login/LoginComponent.vue';

const backUrl = import.meta.env.VITE_BACKEND_URL;
const loginStore = useLoginStore();

</script>

<template>
    <v-app>
        <v-container v-if="loginStore.isLoggedIn">
            <v-app-bar :elevation="2">
                <template v-slot:prepend>
                    <v-app-bar-nav-icon></v-app-bar-nav-icon>
                </template>
                <v-app-bar-title>Repositórios</v-app-bar-title>
            </v-app-bar>
            <RepositoryListComponent></RepositoryListComponent>
        </v-container>
        <v-container v-else class="h-100">
            <LoginComponent></LoginComponent>
        </v-container>
    </v-app>
</template>
<style scoped></style> 