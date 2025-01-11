<template>
  <v-container class="py-6 px-4">
    <v-row dense>
      <v-col cols="12" md="6">
        <v-skeleton-loader
          v-if="userLoading"
          type="heading, list-item-three-line@2, divider, actions"
          class="pa-4"
        />
        <v-card v-else class="mb-4 pa-4">
          <v-card-text>
            <div class="text-h6 mb-2">{{ email }}</div>
            <v-list density="compact" class="pa-0">
              <v-list-item>
                <template #prepend>
                  <v-icon>mdi-calendar</v-icon>
                </template>
                <v-list-item-subtitle>Дата регистрации</v-list-item-subtitle>
                <v-list-item-title>{{ created }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon>mdi-login</v-icon>
                </template>
                <v-list-item-subtitle>Последний вход</v-list-item-subtitle>
                <v-list-item-title>{{ lastSignIn }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-divider />
          <v-card-text>
            <div class="d-flex align-center justify-space-between mb-4">
              <span class="text-body-1">Тема оформления</span>
              <v-btn
                :icon="
                  theme.global.current.value.dark
                    ? 'mdi-weather-sunny'
                    : 'mdi-weather-night'
                "
                variant="text"
                size="small"
                @click="toggleTheme"
              />
            </div>
            <v-btn
              color="error"
              variant="outlined"
              block
              :size="$vuetify.display.smAndDown ? 'small' : 'default'"
              @click="showSignOutDialog = true"
            >
              Выйти из аккаунта
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-skeleton-loader v-if="profilesLoading" class="mt-4">
          <template #default>
            <v-col class="d-flex mb-4" cols="12">
              <v-skeleton-loader type="heading" width="200" class="mr-auto" />
              <v-skeleton-loader type="button" width="150" />
            </v-col>
            <v-row>
              <v-col v-for="i in 2" :key="i" cols="12" sm="12" md="6">
                <v-skeleton-loader
                  type="avatar, list-item-three-line, list-item-three-line, chip, chip"
                  class="pa-4 border rounded"
                />
              </v-col>
            </v-row>
          </template>
        </v-skeleton-loader>
        <div v-else>
          <v-empty-state
            v-if="profiles.length === 0"
            headline="Профили не найдены"
            text="Создайте новый профиль поступающего"
            action-text="Создать"
            @click:action="() => router.push('/profiles/new')"
          />
          <div v-else>
            <div
              class="d-flex flex-wrap align-center justify-space-between mb-4"
            >
              <h2 class="mr-2">Поступающие</h2>
              <v-btn
                color="primary"
                prepend-icon="mdi-plus"
                class="mt-2"
                @click="router.push('/profiles/new')"
              >
                Новый
              </v-btn>
            </div>
            <v-row>
              <v-col
                v-for="profile in profiles"
                :key="profile.id"
                cols="12"
                sm="12"
                md="6"
              >
                <ProfileRegistration :profile="profile" />
              </v-col>
            </v-row>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
  <SignOutDialog
    :show="showSignOutDialog"
    @update:show="showSignOutDialog = $event"
  />
</template>

<script lang="ts" setup>
import { supabase } from "@/lib/supabaseClient";
import router from "@/router";
import type { Profile } from "@/stores/app";
import { ref } from "vue";
import { useTheme } from "vuetify";

const email = ref("");
const created = ref("");
const lastSignIn = ref("");
const userLoading = ref(true);
const profilesLoading = ref(true);
const theme = useTheme();
const showSignOutDialog = ref(false);

const profiles = ref<Profile[]>([]);

onMounted(() => {
  loadUser();
  loadProfiles();
});

const loadUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User not found");
    return;
  }

  email.value = user.email ?? "";
  if (user.created_at) {
    created.value = formatTimestamp(user.created_at);
  }
  if (user.last_sign_in_at) {
    lastSignIn.value = formatTimestamp(user.last_sign_in_at);
  }

  userLoading.value = false;
};

const loadProfiles = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("approved", { ascending: false });

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

<style scoped>
.border {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>

<route lang="yaml">
meta:
  layout: authed
</route>
