// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import colors from "vuetify/util/colors";

// Vuetify
import { createVuetify, type ThemeDefinition } from "vuetify";

const customTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#9B37FB',
    background: '#000000'
  },
};

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "customTheme",
    themes: {
      customTheme,
    },
  },
});
