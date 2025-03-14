<template>
  <v-card
    density="compact"
    :class="{
      'profile-card-moderation': !profile.approved,
      'profile-card-approved': profile.approved,
      'profile-card-selected': store.profile?.id === profile.id,
    }"
    @click="selectProfile"
  >
    <div
      class="d-flex flex-sm-row flex-column pa-4 align-sm-start align-center gap-4"
    >
      <v-avatar
        v-if="profile.avatar"
        :image="avatar_url.data.publicUrl"
        size="96"
        class="mr-4"
      />
      <div class="flex-grow-1 min-width-0 text-center text-sm-start">
        <v-card-title class="d-flex flex-column pa-0 gap-2">
          <div class="text-wrap">
            {{ profile.last_name }} {{ profile.first_name }}
            {{ profile.patronymic }}
          </div>
          <v-chip
            :color="profile.approved ? 'success' : 'warning'"
            class="align-self-sm-start mt-2 align-self-center"
          >
            {{ profile.approved ? "Подтвержден" : "На модерации" }}
          </v-chip>
        </v-card-title>
        <v-card-subtitle class="pa-0 pt-2">{{ createdAt }}</v-card-subtitle>
      </div>
    </div>
    <v-card-text class="pa-2">
      <v-list density="compact" class="pa-0">
        <v-row dense class="ma-0">
          <v-col cols="12" sm="6" class="pa-0">
            <v-list-item>
              <v-list-item-title>{{ birthDate }}</v-list-item-title>
              <v-list-item-subtitle>Дата рождения</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>{{ profile.grade }}</v-list-item-title>
              <v-list-item-subtitle>Класс поступления</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>{{ gender }}</v-list-item-title>
              <v-list-item-subtitle>Пол</v-list-item-subtitle>
            </v-list-item>
          </v-col>
          <v-col cols="12" sm="6" class="pa-0">
            <v-list-item>
              <v-list-item-title>{{ profile.parent_phone }}</v-list-item-title>
              <v-list-item-subtitle>Телефон родителя</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="text-wrap text-break">
                {{ profile.parent_last_name }}
                {{ profile.parent_first_name }}
                {{ profile.parent_patronymic }}
              </v-list-item-title>
              <v-list-item-subtitle>ФИО родителя</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <template #title>
                <div class="text-wrap text-break">
                  {{ profile.old_school }}
                </div>
              </template>
              <v-list-item-subtitle>Предыдущая школа</v-list-item-subtitle>
            </v-list-item>
          </v-col>
        </v-row>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-chip :color="profile.june_exam ? 'success' : 'grey'">
        Экзамен в июне
      </v-chip>
      <v-chip :color="profile.vmsh ? 'success' : 'grey'"> ВМШ </v-chip>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { supabase } from "@/lib/supabaseClient";
import { useProfileStore, type Profile } from "@/stores/profile";

const props = defineProps<{
  profile: Profile;
}>();

const store = useProfileStore();

const createdAt = new Date(props.profile.created_at).toLocaleString("ru-RU", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

const birthDate = new Date(props.profile.birth_date).toLocaleDateString(
  "ru-RU",
  {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
);

const gender =
  props.profile.gender === "M"
    ? "Мужской"
    : props.profile.gender === "F"
    ? "Женский"
    : "Не указан";

const avatar_url = supabase.storage
  .from("avatars")
  .getPublicUrl(props.profile.avatar);

const selectProfile = () => {
  if (!props.profile.approved) return;
  store.setProfile(props.profile);
};
</script>

<style scoped>
.profile-card-moderation {
  border-left: 6px solid rgb(var(--v-theme-warning)) !important;
  pointer-events: none !important;
}

.profile-card-approved {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out,
    border 0.2s ease-in-out;
}

.profile-card-approved:hover {
  border: 2px solid rgb(var(--v-theme-success)) !important;
  transform: scale(1.005);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.profile-card-selected {
  border: 2px solid rgb(var(--v-theme-primary)) !important;
}
</style>
