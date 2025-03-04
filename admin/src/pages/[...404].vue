<template>
  <v-empty-state
    headline="404"
    :text="$route.fullPath"
    title="Страница не найдена"
    action-text="На главную"
    @click:action="() => $router.push('/profile')"
  />
</template>
