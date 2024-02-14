// Styles
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, md } from "vuetify/iconsets/md";
// Vuetify
import { createVuetify } from "vuetify";

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "md",
    aliases,
    sets: {
      md,
    },
  },
});
