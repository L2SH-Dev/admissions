<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item to="/profiles" prepend-icon="mdi-account-multiple">
          Профили
        </v-list-item>
        <v-list-item to="/support" prepend-icon="mdi-chat-question">
          Поддержка
        </v-list-item>
        <v-list-item to="/exams" prepend-icon="mdi-file-document">
          Экзамены
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar style="position: fixed" :color="appBarColor" elevation="3">
      <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />
      <div class="d-flex align-center">
        <v-img
          src="@/assets/L2SH-logo.png"
          width="48"
          height="48"
          class="me-2 ml-4"
          alt="L2SH Logo"
          @click="goToIndex"
        />
        <div class="d-none d-md-flex">
          <v-btn to="/exams" prepend-icon="mdi-file-document" class="mx-2">
            Экзамены
          </v-btn>
          <v-btn to="/support" prepend-icon="mdi-chat-question" class="mx-2">
            Поддержка
          </v-btn>
        </div>
      </div>
      <v-spacer />
      <div class="d-none d-md-flex">
        <v-btn
          to="/profiles"
          prepend-icon="mdi-account-multiple"
          class="ms-2 mr-4"
        >
          Профили
        </v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { ref, computed } from "vue";
import { useTheme } from "vuetify";

const router = useRouter();
const drawer = ref(false);
const theme = useTheme();

const goToIndex = () => {
  router.push("/");
};

const appBarColor = computed(() => {
  return theme.global.current.value.dark ? "" : "#EEEEEE";
});
</script>
