<script setup lang="ts">
import { useRepositoryStore, type Repository } from '@/stores/repositories';
import { computed } from 'vue';
import { ref } from 'vue';

const repositoryStore = useRepositoryStore();
const snackbar = ref(false);
const text = ref('');
const branches = ['develop', 'main', 'homolog'];
const branchesFrom = ref(branches);

const branchFrom = ref('main');
const branchTo = ref('develop');

const branchesTo = computed(() =>
    branches.filter((b) => b != branchFrom.value)
);

const hasOneOrMorePrs = computed(() =>
    repositoryStore.repositories.some((repo) => repo.pullRequest != null)
);

const hasOneOrMoreLoadingRepos = computed(() =>
    repositoryStore.repositories.some((repo) => repo.loading)
);


function onClickCreatePr(repository: Repository) {
    if (branchFrom.value && branchTo.value) {
        repositoryStore.createPrForRepository(repository, branchFrom.value, branchTo.value);
    } else {
        text.value = 'Informe as branches de origem e destino corretamente!';
        snackbar.value = true;
    }
}

function onClickMergePr(repository: Repository) {
    repositoryStore.mergePullRequest(repository);
}

function onClickDeclinePr(repository: Repository) {
    repositoryStore.declinePullRequest(repository);
}

function showError(content: any) {
    text.value = content.toString();
    snackbar.value = true;
}

function onClickViewePr(repository: Repository) {
    if (repository.pullRequest?.links.html) {
        window.open(repository.pullRequest?.links.html.href);
    }
}

function onClickMergeAllPrs() {
    repositoryStore.mergeAllPrs();
}

function onClickDeclineAllPrs() {
    repositoryStore.declineAllPrs();
}

function onClickCreateAllPrs() {
    if (branchFrom.value && branchTo.value) {
        repositoryStore.createPullRequestForAllRepos(branchFrom.value, branchTo.value);
    } else {
        text.value = 'Informe as branches de origem e destino corretamente!';
        snackbar.value = true;
    }
}

function onChangeBranchFrom() {
    branchTo.value = '';
}

</script>
<template>
    <v-container class="general-actions d-flex">
        <div class="branch-selector">
            <v-select @update:modelValue="onChangeBranchFrom" variant="solo" label="From" v-model="branchFrom"
                :items="branchesFrom"></v-select>
            <v-icon icon="arrow_right_alt" color="green"></v-icon>
            <v-select variant="solo" label="To" v-model="branchTo" :items="branchesTo"></v-select>
        </div>
        <div class="buttons">
            <v-btn v-if="hasOneOrMorePrs" :disabled="hasOneOrMoreLoadingRepos" @click="onClickMergeAllPrs()"
                style="margin-left: 10px;" color="green" prepend-icon="merge">Merge All</v-btn>
            <v-btn v-if="hasOneOrMorePrs" :disabled="hasOneOrMoreLoadingRepos" @click="onClickDeclineAllPrs()"
                style="margin-left: 10px;" color="red" prepend-icon="thumb_down">Decline
                All</v-btn>
            <v-btn :disabled="hasOneOrMoreLoadingRepos" @click="onClickCreateAllPrs()" style="margin-left: 10px;"
                color="blue" prepend-icon="sync">Sync All</v-btn>
        </div>
    </v-container>
    <v-container class="repositories-container justify-center">
        <v-sheet class="repository-sheet" v-for="item in repositoryStore.repositories" :elevation="3" rounded :height="70"
            :width="'90%'">
            <div class="repository">
                <div class="icon">
                    <img :src="item.links.avatar.href" alt="">
                </div>
                <div class="name text-h6">{{ item.name }} <v-progress-circular indeterminate v-if="item.loading"
                        model-value="20"></v-progress-circular>
                    <v-icon v-if="item.error != undefined" icon="error" @click="showError(item.error)" color="red"></v-icon>
                    <v-icon v-if="item.success" icon="check_circle" color="green"></v-icon>
                </div>
                <div class="actions">
                    <v-btn v-if="item.pullRequest" @click="onClickViewePr(item)" style="margin-left: 10px;" color="purple"
                        prepend-icon="visibility">View</v-btn>
                    <v-btn v-if="item.pullRequest" @click="onClickMergePr(item)" style="margin-left: 10px;" color="green"
                        prepend-icon="merge">Merge</v-btn>
                    <v-btn v-if="item.pullRequest" @click="onClickDeclinePr(item)" style="margin-left: 10px;" color="red"
                        prepend-icon="thumb_down">Decline</v-btn>
                    <v-btn @click="onClickCreatePr(item)" :disabled="item.pullRequest !== undefined"
                        style="margin-left: 10px;" color="blue" prepend-icon="sync">Sync</v-btn>
                </div>F
            </div>
        </v-sheet>
    </v-container>
    <v-snackbar v-model="snackbar">
        {{ text }}
        <template v-slot:actions>
            <v-btn color="red" variant="text" @click="snackbar = false">
                Fechar
            </v-btn>
        </template>
    </v-snackbar>
</template>


<style scoped lang="scss">
.general-actions {
    margin-top: 50px;
    width: 90%;
    display: flex;
    align-items: center;
    flex-direction: row;

    .branch-selector {
        display: flex;
        width: 320px;
        align-items: center;
        gap: 5px;
    }

    .buttons {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
    }
}

.repositories-container {
    height: calc(100vh - 100px);
    overflow-y: scroll;

    &::-webkit-scrollbar {
        display: none;
    }

    .repository-sheet {
        margin: 0 auto;
        margin-bottom: 20px;

        .repository {
            display: grid;
            overflow: hidden;
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
                max-width: 500px;
                font-size: 20dp;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
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