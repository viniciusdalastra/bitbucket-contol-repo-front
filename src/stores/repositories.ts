import { ref, computed, type Ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type BitBucketRequestI from "@/interfaces/bitbucket-request";
import { useLoginStore } from "./login";

interface RepositoryTuple {
  repository: Repository;
}
export interface Repository {
  type: string;
  full_name: string;
  links: {
    self: { href: string };
    html: { href: string };
    avatar: { href: string };
  };
  name: string;
  uuid: string;
}

export const useRepositoryStore = defineStore("repositories", () => {
  var unfilteredRepositories: Repository[] = [];
  const repositories: Ref<Repository[]> = ref([]);
  const favoriteRepos: Ref<string[]> = ref([]);
  const isLoading = ref(false);

  const savedRepos = JSON.parse(
    localStorage.getItem("bitbucket-repositories") ?? "[]"
  ) as Repository[];

  const savedFavoriteRepos = JSON.parse(
    localStorage.getItem("favorite-repos") ?? "[]"
  );

  favoriteRepos.value = savedFavoriteRepos;

  if (savedRepos.length > 0) {
    unfilteredRepositories = savedRepos;
  } else {
    const urlApi = import.meta.env.VITE_BACKEND_URL;
    const loginStore = useLoginStore();
    isLoading.value = true;
    var currentPage = 1;

    function loadNewPage() {
      axios
        .get<BitBucketRequestI<RepositoryTuple>>(
          `${urlApi}/repositorie?page=${currentPage}&pagelen=100`,
          {
            headers: {
              Authorization: "Bearer " + loginStore.authToken,
            },
          }
        )
        .then((response) => {
          unfilteredRepositories = unfilteredRepositories.concat(
            response.data.values.map((repoValue) => {
              return {
                type: repoValue.repository.type,
                full_name: repoValue.repository.full_name,
                links: repoValue.repository.links,
                name: repoValue.repository.name,
                uuid: repoValue.repository.uuid,
              };
            })
          );
          if (response.data.size > unfilteredRepositories.length) {
            currentPage++;
            loadNewPage();
          } else {
            localStorage.setItem(
              "bitbucket-repositories",
              JSON.stringify(unfilteredRepositories)
            );
            isLoading.value = false;
            repositories.value = unfilteredRepositories;
          }
        });
    }

    loadNewPage();
  }

  function persistFavoriteRepos() {
    localStorage.setItem("favorite-repos", JSON.stringify(favoriteRepos.value));
  }

  function addFavoriteRepo(uuid: string) {
    favoriteRepos.value.push(uuid);
    persistFavoriteRepos();
  }

  function removeFavoriteRepo(uuid: string) {
    favoriteRepos.value = favoriteRepos.value.filter(
      (repoId) => repoId != uuid
    );
    persistFavoriteRepos();
  }

  function filterByName(name: string) {
    if (name != "") {
      repositories.value = unfilteredRepositories.filter((repo) =>
        repo.name.toLowerCase().includes(name.toLocaleLowerCase())
      );
    } else {
      repositories.value = unfilteredRepositories;
    }
  }

  function toggleFavoritesFilter(on: boolean) {
    if (on) {
      repositories.value = unfilteredRepositories.filter((repo) =>
        favoriteRepos.value.includes(repo.uuid)
      );
    } else {
      repositories.value = unfilteredRepositories;
    }
  }

  return {
    isLoading,
    repositories,
    favoriteRepos,
    addFavoriteRepo,
    removeFavoriteRepo,
    filterByName,
    toggleFavoritesFilter,
  };
});
