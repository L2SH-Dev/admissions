<template>
  <v-card density="compact">
    <v-card-title
      class="d-flex flex-column flex-sm-row justify-start align-center"
    >
      <v-avatar
        v-if="profile.avatar"
        :image="avatar_url.data.publicUrl"
        size="96"
        class="mb-2 mb-sm-0 mr-sm-4"
      />
      <div class="text-wrap text-center text-sm-left">
        {{ profile.last_name }} {{ profile.first_name }}
        {{ profile.patronymic }}
      </div>
      <div
        v-if="!profile.approved"
        class="d-flex flex-row ml-sm-auto mt-2 mt-sm-0 justify-center justify-sm-center"
      >
        <v-btn
          variant="tonal"
          color="success"
          class="mr-2"
          icon="mdi-check"
          @click="handleApprove"
        />
        <v-btn
          variant="tonal"
          color="error"
          icon="mdi-close"
          @click="handleReject"
        />
      </div>
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
              <v-list-item-title>
                {{ profile.parent_phone }}
              </v-list-item-title>
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

    <v-dialog v-model="approveDialog" width="auto">
      <v-card>
        <v-card-title>Подтверждение</v-card-title>
        <v-card-text>
          Вы уверены, что хотите одобрить заявку "{{ profile.last_name }}
          {{ profile.first_name }}"?
        </v-card-text>
        <v-card-actions>
          <v-btn color="success" @click="confirmApprove">Одобрить</v-btn>
          <v-btn color="grey" @click="approveDialog = false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="rejectDialog" width="auto">
      <v-card>
        <v-card-title>Подтверждение</v-card-title>
        <v-card-text>
          <p class="mb-4">
            Вы уверены, что хотите отклонить заявку "{{ profile.last_name }}
            {{ profile.first_name }}"?
          </p>
          <v-text-field
            v-model="rejectReason"
            label="Причина отклонения"
            variant="outlined"
            density="compact"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" :disabled="!rejectReason" @click="confirmReject">
            Отклонить
          </v-btn>
          <v-btn color="grey" @click="closeRejectDialog">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, defineProps } from "vue";
import { type Profile } from "@/stores/profile";
import { supabase } from "@/lib/supabaseClient";

const props = defineProps<{
  profile: Profile;
}>();

const emit = defineEmits(["update"]);

const approveDialog = ref(false);
const rejectDialog = ref(false);
const rejectReason = ref("");

const createdAt = new Date(props.profile.created_at).toLocaleString("ru", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

const birthDate = new Date(props.profile.birth_date).toLocaleString("ru", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const gender =
  props.profile.gender !== null
    ? props.profile.gender === "M"
      ? "Мужской"
      : "Женский"
    : "Не указан";

const avatar_url = supabase.storage
  .from("avatars")
  .getPublicUrl(props.profile.avatar);

const handleApprove = () => {
  approveDialog.value = true;
};

const confirmApprove = async () => {
  const { error } = await supabase
    .from("profiles")
    .update({ approved: true })
    .eq("id", props.profile.id);
  approveDialog.value = false;

  if (error) console.error("Error approving profile:", error.message);
  else emit("update");
};

const handleReject = async () => {
  rejectDialog.value = true;
};

const confirmReject = async () => {
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", props.profile.id);
  rejectDialog.value = true;

  if (error) console.error("Error rejecting profile:", error.message);
  else emit("update");
  rejectDialog.value = false;
};

const closeRejectDialog = () => {
  rejectDialog.value = false;
  rejectReason.value = "";
};
</script>
