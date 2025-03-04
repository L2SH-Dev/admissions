<template>
  <v-container>
    <v-tabs v-model="activeTab">
      <v-tab value="pending">Ожидающие</v-tab>
      <v-tab value="approved">Принятые</v-tab>
    </v-tabs>

    <v-tabs-window v-model="activeTab" class="pt-4">
      <v-tabs-window-item value="pending">
        <div class="d-flex align-center justify-space-between mb-4">
          <h2 class="text-h5">Ожидающие регистрации</h2>
          <v-btn
            color="primary"
            :icon="$vuetify.display.xs"
            variant="tonal"
            :loading="profileStore.loadingPending"
            @click="reloadPending"
          >
            <v-icon>mdi-refresh</v-icon>
            <span class="d-none d-sm-inline ml-2">Обновить</span>
          </v-btn>
        </div>

        <v-container>
          <v-empty-state
            v-if="
              profileStore.pendingCount === 0 && !profileStore.loadingPending
            "
            title="Нет ожидающих регистраций"
            icon="mdi-check"
          />
          <Registration
            v-for="p in profileStore.pendingPage"
            :key="p.id"
            :profile="p"
            class="mb-5"
            @update="reloadAll"
          />
        </v-container>

        <v-pagination
          v-model="pendingPage"
          :length="Math.ceil(profileStore.pendingCount / pageSize)"
          @update:model-value="reloadPending"
        />
      </v-tabs-window-item>

      <v-tabs-window-item value="approved">
        <div class="d-flex align-center justify-space-between mb-4">
          <h2 class="text-h5">Принятые регистрации</h2>
          <div>
            <v-btn
              color="primary"
              :icon="$vuetify.display.xs"
              variant="tonal"
              :loading="profileStore.loadingApproved"
              @click="reloadApproved"
            >
              <v-icon>mdi-refresh</v-icon>
              <span class="d-none d-sm-inline ml-2">Обновить</span>
            </v-btn>
          </div>
        </div>

        <v-container>
          <v-empty-state
            v-if="
              profileStore.approvedCount === 0 && !profileStore.loadingApproved
            "
            title="Нет принятых регистраций"
            icon="mdi-delete"
          />
          <Registration
            v-for="p in profileStore.approvedPage"
            :key="p.id"
            :profile="p"
            class="mb-5"
            @update="reloadAll"
          />
        </v-container>

        <v-pagination
          v-model="approvedPage"
          :length="Math.ceil(profileStore.approvedCount / pageSize)"
          @update:model-value="reloadApproved"
        />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<script lang="ts" setup>
import { useProfileStore } from "@/stores/profile";

const profileStore = useProfileStore();
const activeTab = ref("pending");

const pageSize = 5;
const pendingPage = ref(1);
const approvedPage = ref(1);

onMounted(() => {
  reloadAll();
});

const reloadAll = () => {
  reloadPending();
  reloadApproved();
};

const reloadPending = () => {
  profileStore.loadPending(pendingPage.value - 1, pageSize);
};

const reloadApproved = () => {
  profileStore.loadApproved(approvedPage.value - 1, pageSize);
};
</script>

<route lang="yaml">
meta:
  layout: dashboard
</route>
