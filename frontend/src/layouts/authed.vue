<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app temporary style="position: fixed">
      <v-list>
        <v-list-item
          v-if="store.profile"
          class="profile-list-item mb-2"
          to="/profiles"
        >
          <div class="d-flex align-center">
            <v-avatar
              size="40"
              class="mr-3"
              :image="
                supabase.storage
                  .from('avatars')
                  .getPublicUrl(store.profile.avatar).data.publicUrl
              "
            />
            <div>
              <div class="text-subtitle-2 font-weight-medium">
                {{ store.profile.first_name }} {{ store.profile.last_name }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ store.profile.grade }} класс
              </div>
            </div>
          </div>
        </v-list-item>
        <v-divider v-if="store.profile" class="mb-2" />
        <v-list-item v-else to="/profiles" prepend-icon="mdi-account-multiple">
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
      <div class="d-md-none mr-4">
        <v-btn
          v-if="store.profile"
          icon
          size="small"
          @click="$router.push('/profiles')"
        >
          <v-avatar
            size="40"
            :image="
              supabase.storage
                .from('avatars')
                .getPublicUrl(store.profile.avatar).data.publicUrl
            "
          />
        </v-btn>
        <v-btn v-else icon="mdi-account-multiple" size="small" to="/profiles" />
      </div>
      <div class="d-none d-md-flex">
        <v-btn
          v-if="!store.profile"
          prepend-icon="mdi-account-multiple"
          class="ms-2 mr-4"
          to="/profiles"
        >
          Профили
        </v-btn>
        <v-btn
          v-else
          class="profile-btn mr-4 px-4"
          variant="text"
          @click="$router.push('/profiles')"
        >
          <div class="d-flex align-center">
            <div class="mr-3">
              <div class="text-subtitle-2 font-weight-medium">
                {{ store.profile.first_name }} {{ store.profile.last_name }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ store.profile.grade }} класс
              </div>
            </div>
            <v-avatar
              size="40"
              :image="
                supabase.storage
                  .from('avatars')
                  .getPublicUrl(store.profile.avatar).data.publicUrl
              "
            />
          </div>
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
import { useProfileStore } from "@/stores/profile";
import { supabase } from "@/lib/supabaseClient";

const store = useProfileStore();

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

<style scoped>
.profile-btn {
  transition: background-color 0.2s ease;
  border-radius: 8px;
  height: auto !important;
  min-height: 48px;
}

.profile-btn:hover {
  background-color: rgba(var(--v-theme-surface-variant), 0.2);
}

.profile-list-item {
  min-height: 64px !important;
  transition: background-color 0.2s ease;
}

.profile-list-item:hover {
  background-color: rgba(var(--v-theme-surface-variant), 0.2);
}
</style>
