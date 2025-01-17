/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router/auto";
import { setupLayouts } from "virtual:generated-layouts";
import { routes } from "vue-router/auto-routes";
import { supabase } from "@/lib/supabaseClient";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.layout === "dashboard") {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      next({ path: "/", query: { redirect: to.fullPath } });
      return;
    }

    const { data: user_roles, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    if (error) {
      console.error(error);
      next({ path: "/", query: { redirect: to.fullPath } });
      return;
    }

    if (!user_roles.some((role) => role.role === "admin")) {
      next({ path: "/notadmin" });
      return;
    }
  }

  if (to.path === "/" || to.path === "/register") {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      next({ path: "/profile" });
      return;
    }
  }

  next();
});

export default router;
