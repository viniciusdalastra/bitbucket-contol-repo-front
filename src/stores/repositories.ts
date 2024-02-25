import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import { useLoginStore } from "./login";

export interface Repository {
  type: string;
  full_name: string;
  links: {
    self: Link;
    html: Link;
    avatar: Link;
  };
  name: string;
  uuid: string;
  workspace: string;
  loading?: boolean;
  success?: boolean;
  error?: any;
  pullRequest?: CreatePullRequestResponse;
}

export interface CreatePullRequestResponse {
  branch: string;
  id: number;
  name: string;
  links: {
    activity: Link;
    approve: Link;
    comments: Link;
    commits: Link;
    decline: Link;
    diff: Link;
    diffstat: Link;
    html: Link;
    merge: Link;
    "request-changes": Link;
    self: Link;
    statuses: Link;
  };
}

export interface Link {
  href: string;
}

export const useRepositoryStore = defineStore("repositories", () => {
  const repositories: Ref<Repository[]> = ref([]);
  const isLoading = ref(false);
  const urlApi = import.meta.env.VITE_BACKEND_URL;
  const loginStore = useLoginStore();

  const headers = {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
    Authorization: "Bearer " + loginStore.authToken,
  };

  const savedRepos = JSON.parse(
    localStorage.getItem("bitbucket-repositories") ?? "[]"
  ) as Repository[];

  if (savedRepos.length > 0) {
    repositories.value = savedRepos;
  } else {
    isLoading.value = true;

    axios
      .get<Repository[]>(`${urlApi}/repositorie/default`, {
        headers: {
          Authorization: "Bearer " + loginStore.authToken,
        },
      })
      .then((response) => {
        repositories.value = response.data;
        persistRepositories();
        isLoading.value = false;
      });
  }

  function persistRepositories() {
    localStorage.setItem(
      "bitbucket-repositories",
      JSON.stringify(repositories.value)
    );
  }

  async function createPrForRepository(repository: Repository) {
    const updatingIndex = repositories.value.indexOf(repository);
    repositories.value[updatingIndex].loading = true;
    repositories.value[updatingIndex].error = undefined;
    repositories.value[updatingIndex].success = false;
    axios
      .post<CreatePullRequestResponse[]>(
        `${urlApi}/repositorie/default/pull-request`,
        {
          from: "main",
          to: "develop",
          repositorie: repository,
        },
        {
          headers,
        }
      )
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const createdPr = response.data
            .filter((pr) => pr.name == repository.name)
            .pop();
          repositories.value[updatingIndex].loading = false;
          repositories.value[updatingIndex].pullRequest = createdPr;
          persistRepositories();
        }
      })
      .catch((error) => {
        repositories.value[updatingIndex].loading = false;
        repositories.value[updatingIndex].error = error;
        persistRepositories();
      });
  }

  async function declinePullRequest(repository: Repository) {
    const updatingIndex = repositories.value.indexOf(repository);
    repositories.value[updatingIndex].loading = true;
    repositories.value[updatingIndex].error = undefined;
    repositories.value[updatingIndex].success = false;
    axios
      .post(
        `${urlApi}/repositorie/pull-request/${repository.workspace}/${
          repository.uuid
        }/${repository.pullRequest!.id}/decline`,
        {},
        {
          headers,
        }
      )
      .then((response) => {
        if (response && response.status == 201 && !response.data.error) {
          repositories.value[updatingIndex].pullRequest = undefined;
          repositories.value[updatingIndex].loading = false;
          repositories.value[updatingIndex].success = true;
          setTimeout(() => {
            repositories.value[updatingIndex].success = false;
            persistRepositories();
          }, 5000);
        }
        if (response.data.error) {
          repositories.value[updatingIndex].loading = false;
          repositories.value[updatingIndex].error =
            response.data?.error?.message;
        }
      })
      .catch((error) => {
        repositories.value[updatingIndex].loading = false;
        repositories.value[updatingIndex].error = error;
        persistRepositories();
      });
  }

  async function mergePullRequest(repository: Repository) {
    const updatingIndex = repositories.value.indexOf(repository);
    repositories.value[updatingIndex].loading = true;
    repositories.value[updatingIndex].error = undefined;
    repositories.value[updatingIndex].success = false;
    axios
      .post(
        `${urlApi}/repositorie/pull-request/${repository.workspace}/${
          repository.uuid
        }/${repository.pullRequest!.id}/merge`,
        {},
        {
          headers,
        }
      )
      .then((response) => {
        repositories.value[updatingIndex].loading = false;
        if (response && response.status == 201 && !response.data.error) {
          repositories.value[updatingIndex].pullRequest = undefined;
          repositories.value[updatingIndex].success = true;
          setTimeout(() => {
            repositories.value[updatingIndex].success = false;
            persistRepositories();
          }, 5000);
        }

        if (response.data.error) {
          repositories.value[updatingIndex].loading = false;
          repositories.value[updatingIndex].error =
            response.data?.error?.message;
        }
      })
      .catch((error) => {
        repositories.value[updatingIndex].loading = false;
        repositories.value[updatingIndex].error = error;
        persistRepositories();
      });
  }

  async function createPullRequestForAllRepos() {
    for (const repo of repositories.value) {
      if (!repo.pullRequest) {
        createPrForRepository(repo);
      }
    }
  }

  async function mergeAllPrs() {
    for (const repo of repositories.value) {
      if (repo.pullRequest) {
        mergePullRequest(repo);
      }
    }
  }

  async function declineAllPrs() {
    for (const repo of repositories.value) {
      if (repo.pullRequest) {
        declinePullRequest(repo);
      }
    }
  }

  return {
    isLoading,
    repositories,
    createPrForRepository,
    declinePullRequest,
    mergePullRequest,
    createPullRequestForAllRepos,
    mergeAllPrs,
    declineAllPrs
  };
});
