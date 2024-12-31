<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="text-center pa-6" max-width="500">
      <v-card-title class="text-h3 mb-4"> 404 </v-card-title>
      <v-card-subtitle class="text-h5 mb-4">
        Страница не найдена
      </v-card-subtitle>
      <v-card-text>
        <p class="mb-4">
          {{ $route.fullPath }}
        </p>
        <v-btn color="primary" to="/" variant="elevated"> На главную </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
//
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
