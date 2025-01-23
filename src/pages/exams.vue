<template>
  <v-container>
    <v-tabs v-model="activeTab">
      <v-tab value="list">Список</v-tab>
      <v-tab value="create">Создать</v-tab>
    </v-tabs>

    <v-tabs-window v-model="activeTab" class="pt-4">
      <v-tabs-window-item value="list">
        <div class="d-flex align-center justify-space-between mb-4">
          <h2 class="text-h5">Экзамены</h2>
          <v-btn
            color="primary"
            :icon="$vuetify.display.xs"
            variant="tonal"
            @click="store.load"
          >
            <v-icon>mdi-refresh</v-icon>
            <span class="d-none d-sm-inline ml-2">Обновить</span>
          </v-btn>
        </div>

        <template v-if="store.exams.length">
          <div v-for="exam in store.exams" :key="exam.id">
            <Exam :exam="exam" @update="store.load" />
          </div>
        </template>
        <v-alert v-else type="info" text="Нет актуальных экзаменов" />
      </v-tabs-window-item>

      <v-tabs-window-item value="create">
        <!-- <CreateExam @exam-created="examCreated" /> -->
        <h1>create</h1>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<script lang="ts" setup>
import { useExamStore } from "@/stores/exam";

const store = useExamStore();

const activeTab = ref("list");

// const examCreated = () => {
//   activeTab.value = "list";
//   statusChanged();
// };

onMounted(() => {
  store.load();
});
</script>

<style scoped></style>

<route lang="yaml">
meta:
  layout: dashboard
</route>
