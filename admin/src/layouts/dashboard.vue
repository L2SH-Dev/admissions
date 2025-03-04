<template>
  <v-app style="height: 100vh">
    <v-navigation-drawer
      v-model="drawer"
      :rail="!smAndDown && rail"
      :temporary="smAndDown"
      :permanent="!smAndDown"
      @click="rail = false"
    >
      <v-list>
        <v-list-item to="/profile" prepend-icon="mdi-account" title="Профиль" />
        <v-list-item
          title="Регистрации"
          prepend-icon="mdi-format-list-bulleted"
          to="/registrations"
        />
        <v-list-item
          title="Экзамены"
          prepend-icon="mdi-file-document"
          to="/exams"
        />
        <v-list-item title="Результаты" prepend-icon="mdi-chart-bar" disabled />
        <v-list-item title="Показ работ" prepend-icon="mdi-eye" disabled />
        <v-list-item title="Чаты" prepend-icon="mdi-message" disabled />
        <v-list-item title="Достижения" prepend-icon="mdi-trophy" disabled />
        <v-list-item title="Отзывы" prepend-icon="mdi-star" disabled />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar v-if="smAndDown" position="fixed">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Админ панель</v-toolbar-title>
    </v-app-bar>

    <v-main
      style="overflow: auto; max-height: 100vh"
      :class="{ 'pt-15': smAndDown }"
      @click="!smAndDown && (rail = true)"
    >
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";

const { smAndDown } = useDisplay();
const drawer = ref(!smAndDown.value);
const rail = ref(false);
const router = useRouter();

// Close drawer when route changes on mobile
router.afterEach(() => {
  if (smAndDown.value) {
    drawer.value = false;
  }
});
</script>

<style>
.v-navigation-drawer__content:not(:hover)::-webkit-scrollbar {
  display: none;
}

.v-navigation-drawer__content:not(:hover) {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.v-navigation-drawer__content:hover {
  scrollbar-width: thin;
}
</style>
