<template>
  <v-empty-state
    v-if="store.profile === null"
    icon="mdi-book-open-variant"
    text="Выберите профиль для просмотра экзаменов"
    title="Не выбран профиль"
    action-text="Выбрать профиль"
    @click:action="() => $router.push('/profiles')"
  />
</template>

<script lang="ts" setup>
import { useAppStore } from "@/stores/app";

const store = useAppStore();
</script>

<route lang="yaml">
meta:
  layout: authed
</route>
