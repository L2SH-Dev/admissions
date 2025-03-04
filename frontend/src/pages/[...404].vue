<template>
  <v-empty-state
    headline="404"
    :text="$route.fullPath"
    title="Страница не найдена"
    action-text="На главную"
    @click:action="() => $router.push('/')"
  />
</template>

<script lang="ts" setup>
//
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
