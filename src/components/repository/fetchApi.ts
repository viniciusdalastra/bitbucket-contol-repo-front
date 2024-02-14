import axios from 'axios';
import { Repository } from './RepositoryTableComponent.vue';

function fetchApi(page: number, pageLen: number) {
const urlApi = import.meta.env.VITE_BACKEND_URL;
return axios.get<BitbucketRequest<Repository>>(`${urlApi}/repositorie?page=${page}?pageLen=${pageLen}`);
}
