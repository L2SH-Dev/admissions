<template>
  <v-container>
    <v-skeleton-loader v-if="userLoading" type="card" />
    <v-card v-else>
      <p>{{ email }}</p>
      <p>Дата регистрации: {{ created }}</p>
      <p>Последний вход: {{ lastSignIn }}</p>

      <div class="px-3 px-sm-4 mb-4">
        <div class="text-subtitle-1 mb-2">Настройки</div>
        <div class="d-flex flex-wrap align-center gap-4">
          <span class="d-flex align-center">
            <span class="text-body-1">Тема оформления</span>
            <v-btn
              :icon="
                theme.global.current.value.dark
                  ? 'mdi-weather-sunny'
                  : 'mdi-weather-night'
              "
              variant="text"
              class="ml-2"
              size="small"
              @click="toggleTheme"
            />
          </span>
        </div>
      </div>
    </v-card>
    <v-divider />
    <v-skeleton-loader v-if="profilesLoading" type="card,card,card" />
    <div v-else>
      <v-empty-state
        v-if="profiles.length === 0"
        headline="Профили не найдены"
        text="Создайте новый профиль поступающего"
        action-text="Создать"
        @click:action="() => router.push('/profiles/new')"
      />
      <v-container v-else class="px-0">
        <v-btn
          color="primary"
          class="mb-3"
          @click="router.push('/profiles/new')"
        >
          Создать профиль поступающего
        </v-btn>
        <ProfileRegistration
          v-for="profile in profiles"
          :key="profile.id"
          :profile="profile"
          class="mb-3"
        />
      </v-container>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import type { Profile } from "@/components/ProfileRegistration.vue";
import { supabase } from "@/lib/supabaseClient";
import router from "@/router";
import { ref } from "vue";
import { useTheme } from "vuetify";

const email = ref("");
const created = ref("");
const lastSignIn = ref("");
const userLoading = ref(true);
const profilesLoading = ref(true);
const theme = useTheme();

const profiles = ref<Profile[]>([]);

onMounted(() => {
  loadUser();
  loadProfiles();
});

const loadUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    email.value = user.email ?? "";
    if (user.created_at) {
      created.value = formatTimestamp(user.created_at);
    }
    if (user.last_sign_in_at) {
      lastSignIn.value = formatTimestamp(user.last_sign_in_at);
    }
  } else {
    router.push("/login");
  }

  userLoading.value = false;
};

const loadProfiles = async () => {
  const { data, error } = await supabase.from("profiles").select("*");

  if (error) {
    console.error(error);
  } else {
    profiles.value = data;
  }

  profilesLoading.value = false;
};

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
  localStorage.setItem("theme", theme.global.name.value);
};

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};
</script>
