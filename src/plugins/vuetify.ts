/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Locales
import { ru } from "vuetify/locale";

// Composables
import { createVuetify } from "vuetify";

// Get system preference or stored theme
const getInitialTheme = () => {
  const stored = localStorage.getItem("theme");
  if (stored) return stored;

  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return systemDark ? "dark" : "light";
};

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: getInitialTheme(),
  },
  locale: {
    locale: "ru",
    fallback: "en",
    messages: { ru },
  },
});
