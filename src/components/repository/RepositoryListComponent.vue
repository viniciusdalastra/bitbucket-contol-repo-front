<script setup lang="ts">
import { useRepositoryStore, type Repository } from '@/stores/repositories';
import { onMounted } from 'vue';
import { ref } from 'vue';

const repositoryStore = useRepositoryStore();
const blockFavoritesFilter = ref(false);
const blockSearchFilter = ref(false);


const nameFilter = ref('');
const onlyFavorites = ref(false);


function onKeyUpFilter() {
    if (nameFilter.value != '') {
        blockFavoritesFilter.value = true;
    } else {
        blockFavoritesFilter.value = false;
    }

    repositoryStore.filterByName(nameFilter.value);
}

function toggleOnlyFavorites() {
    if (onlyFavorites.value) {
        blockSearchFilter.value = true;
    } else {
        blockSearchFilter.value = false;
    }

    repositoryStore.toggleFavoritesFilter(onlyFavorites.value);

}

function toggleFavorite(repo: Repository) {
    if (repositoryStore.favoriteRepos.includes(repo.uuid)) {
        repositoryStore.removeFavoriteRepo(repo.uuid);
    } else {
        repositoryStore.addFavoriteRepo(repo.uuid);
    }
}

onMounted(() => {
    repositoryStore.filterByName('');
    repositoryStore.toggleFavoritesFilter(false);
});

</script>
<template>
    <v-container class="filters d-flex">
        <v-text-field :disabled="blockSearchFilter" @keyup="onKeyUpFilter" v-model="nameFilter"
            label="Filtrar por nome"></v-text-field>
        <v-checkbox :disabled="blockFavoritesFilter" @change="toggleOnlyFavorites" v-model="onlyFavorites"
            label="Somente favoritos"></v-checkbox>
    </v-container>
    <v-container class="repositories-container justify-center">
        <v-sheet class="repository-sheet" v-for="item in repositoryStore.repositories" :elevation="3" rounded :height="70"
            :width="'60%'">
            <div class="repository">
                <div class="icon">
                    <img :src="item.links.avatar.href" alt="">
                </div>
                <div class="name text-h6">{{ item.name }}</div>
                <div class="actions">
                    <v-icon @click="toggleFavorite(item)" icon="star"
                        :color="repositoryStore.favoriteRepos.includes(item.uuid) ? 'orange' : 'grey'" />
                    <v-btn style="margin-left: 10px;" color="green" prepend-icon="sync">Sync</v-btn>
                </div>
            </div>
        </v-sheet>
    </v-container>
</template>


<style scoped lang="scss">
.filters {
    margin-top: 50px;
    width: 60%;

}

.repositories-container {
    height: calc(100vh - 200px);
    overflow-y: scroll;

    &::-webkit-scrollbar {
        display: none;
    }

    .repository-sheet {
        margin: 0 auto;
        margin-bottom: 20px;

        .repository {
            display: grid;
            grid-template-columns: 70px auto auto;
            gap: 20px;

            .icon {
                img {
                    width: 70px;
                    height: 70px;
                    border-top-left-radius: 4px;
                    border-bottom-left-radius: 4px;
                }
            }

            .name {
                align-self: center;
                margin-bottom: 5px;
            }

            .actions {
                margin-bottom: 5px;
                padding-left: 20px;
                padding-right: 20px;
                justify-self: flex-end;
                align-self: center;
                align-items: center;
                display: flex;
            }

        }
    }

}
</style>