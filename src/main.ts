import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import { createPinia } from "pinia";


loadFonts();

import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(vuetify);

app.mount("#app");
