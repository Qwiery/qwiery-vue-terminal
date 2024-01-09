import type { App } from "vue";
import Terminal from "./components/Terminal.vue";

export default {
  install: (app: App) => {
    app.component("Terminal", Terminal);
  },
};

export { Terminal };
