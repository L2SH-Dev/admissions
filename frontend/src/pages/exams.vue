<template>
  <v-empty-state
    v-if="profileStore.profile === null"
    icon="mdi-book-open-variant"
    text="Выберите профиль для просмотра экзаменов"
    title="Не выбран профиль"
    action-text="Выбрать профиль"
    @click:action="() => $router.push('/profiles')"
  />
  <v-container v-else>
    <v-tabs v-model="activeTab">
      <v-tab value="available">Доступные</v-tab>
      <v-tab value="mine">Мои экзамены</v-tab>
    </v-tabs>
    <v-tabs-window v-model="activeTab" class="pt-4">
      <v-tabs-window-item value="available">
        <div class="d-flex align-center justify-space-between mb-4">
          <v-btn
            color="primary"
            :icon="$vuetify.display.xs"
            variant="tonal"
            :loading="loadingAvailable"
            :disabled="loadingAvailable"
            @click="reloadAvailable"
          >
            <v-icon>mdi-refresh</v-icon>
            <span class="d-none d-sm-inline ml-2">Обновить</span>
          </v-btn>
        </div>

        <template v-if="examStore.availableExams.length">
          <div v-for="exam in examStore.availableExams" :key="exam.id">
            <ExamCard :data="exam" />
          </div>
        </template>
        <v-alert
          v-else-if="!loadingAvailable"
          type="info"
          text="Нет доступных экзаменов"
        />
      </v-tabs-window-item>
      <v-tabs-window-item value="mine">
        <div class="d-flex align-center justify-space-between mb-4">
          <v-btn
            color="primary"
            :icon="$vuetify.display.xs"
            variant="tonal"
            :loading="loadingHistory"
            :disabled="loadingHistory"
            @click="reloadHistory"
          >
            <v-icon>mdi-refresh</v-icon>
            <span class="d-none d-sm-inline ml-2">Обновить</span>
          </v-btn>
        </div>

        <template v-if="examStore.historyExams.length">
          <div v-for="exam in examStore.historyExams" :key="exam.id">
            <ExamCard :data="exam" />
          </div>
        </template>
        <v-alert
          v-else-if="!loadingHistory"
          type="info"
          text="Нет истории экзаменов"
        />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<script lang="ts" setup>
import { useExamStore } from "@/stores/exam";
import { useProfileStore } from "@/stores/profile";

const profileStore = useProfileStore();
const examStore = useExamStore();

const activeTab = ref("available");

const loadingAvailable = ref(true);
const loadingHistory = ref(true);

onMounted(() => {
  reloadAvailable();
  reloadHistory();
});

const reloadAvailable = async () => {
  loadingAvailable.value = true;
  await examStore.loadAvailable();
  loadingAvailable.value = false;
};

const reloadHistory = async () => {
  loadingHistory.value = true;
  await examStore.loadHistory();
  loadingHistory.value = false;
};
</script>

<route lang="yaml">
meta:
  layout: authed
</route>
