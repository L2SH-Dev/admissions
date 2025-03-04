<template>
  <v-container class="py-6 px-4">
    <v-row dense>
      <v-col cols="12" md="6">
        <v-skeleton-loader
          v-if="userLoading"
          type="heading, list-item-three-line@3, divider, actions"
          class="pa-4"
        />
        <v-card v-else class="mb-4 pa-4">
          <v-card-text>
            <div class="text-h6 mb-2">{{ email }}</div>
            <v-list density="compact" class="pa-0">
              <v-list-item>
                <template #prepend>
                  <v-icon>mdi-account</v-icon>
                </template>
                <v-list-item-subtitle>Роль</v-list-item-subtitle>
                <v-list-item-title>{{ role }}</v-list-item-title>
              </v-list-item>
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
    </v-row>
  </v-container>
  <SignOutDialog
    :show="showSignOutDialog"
    @update:show="showSignOutDialog = $event"
  />
</template>

<script lang="ts" setup>
import { useTheme } from "vuetify";
import { supabase } from "@/lib/supabaseClient";

let userId: string | null = null;

const email = ref("");
const role = ref("");
const created = ref("");
const lastSignIn = ref("");
const userLoading = ref(true);
const theme = useTheme();
const showSignOutDialog = ref(false);

onMounted(() => {
  loadUser();
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

  userId = user.id;
  loadRole();
};

const loadRole = async () => {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching user role", error);
    return;
  }

  role.value = data?.role ?? "";
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

<route lang="yaml">
meta:
  layout: dashboard
</route>
