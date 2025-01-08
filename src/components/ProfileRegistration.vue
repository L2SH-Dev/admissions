<template>
  <v-card density="compact">
    <v-card-title
      class="d-flex flex-wrap gap-2 justify-space-between text-wrap align-center"
    >
      <span class="mr-2">
        {{ profile.last_name }} {{ profile.first_name }}
        {{ profile.patronymic }}
      </span>
      <v-chip v-if="profile.approved" color="success">Подтвержден</v-chip>
      <v-chip v-else color="warning">На модерации</v-chip>
    </v-card-title>
    <v-card-subtitle>{{ createdAt }}</v-card-subtitle>
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
export interface Profile {
  id: string;
  approved: boolean;
  birth_date: string;
  created_at: string;
  first_name: string;
  last_name: string;
  patronymic: string | null;
  gender: string | null;
  grade: number;
  old_school: string;
  parent_first_name: string;
  parent_last_name: string;
  parent_patronymic: string | null;
  parent_phone: string;
  source: string;
  june_exam: boolean;
  vmsh: boolean;
}

const props = defineProps<{
  profile: Profile;
}>();

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
</script>
