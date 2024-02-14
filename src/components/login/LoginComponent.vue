<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
const username = ref('');
const password = ref('');
const apiUrl = import.meta.env.VITE_BACKEND_URL;
const isLoading = ref(false);
function login() {
    isLoading.value = true;
    if (!username.value || !password.value) {
        return;
    }

    axios.post(`${apiUrl}/auth`, { login: username.value, password: password.value }).then(async (response) => {
        localStorage.setItem('auth-token', response.data);
        setTimeout(() => {
            window.location.href = window.location.href
        }, 500);
    }).catch((err) => {
        console.log(err);
    });

}

function required(value: any) {
    return !!value || 'Obrigatório'
}

function onKeyPressedLogin(key: KeyboardEvent) {
    if (key.key == 'Enter') {
        login();
    }
}

</script>
<template>
    <v-container class="fill-height">
        <v-row align="center" justify="center">
            <v-card @keyup="onKeyPressedLogin" class="mx-auto" max-width="344" :variant="'elevated'" :elevation="6"
                :loading="isLoading">
                <template v-slot:loader="{ isActive }">
                    <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate></v-progress-linear>
                </template>
                <v-card-item>
                    <div>
                        <div class="text-h6 mb-1">
                            Login
                        </div>
                    </div>
                </v-card-item>
                <v-card-item>
                    <v-sheet width="300" class="mx-auto">
                        <v-form>
                            <v-text-field :rules="[required]" :color="'black'" v-model="username"
                                label="Username"></v-text-field>
                            <v-text-field :rules="[required]" type="password" v-model="password"
                                label="Password"></v-text-field>
                        </v-form>
                    </v-sheet>
                </v-card-item>
                <v-card-actions>
                    <v-btn v-on:click="login">
                        Login
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-row>
    </v-container>
</template>