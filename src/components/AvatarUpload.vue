<template>
  <div class="avatar-upload">
    <div class="avatar-container">
      <v-avatar
        v-if="!url"
        icon="mdi-account"
        :size="size"
        variant="elevated"
        color="surface-variant"
        class="avatar-hover"
      />
      <v-avatar v-else :size="size" :image="url" class="avatar-hover" />
    </div>
    <v-file-input
      label="Загрузите фото поступающего"
      prepend-icon="mdi-camera"
      accept="image/*"
      class="mt-4"
      hide-details
      width="100%"
      @update:model-value="change"
    />
  </div>
</template>

<script lang="ts" setup>
const prop = defineProps<{
  size: number;
}>();
const { size } = toRefs(prop);

const emit = defineEmits(["change:file"]);
const url = ref("");

const change = async (files: File | File[]) => {
  const newFile = Array.isArray(files) ? files[0] : files;

  if (newFile) url.value = URL.createObjectURL(newFile);
  else url.value = "";

  emit("change:file", newFile);
};
</script>

<style scoped>
.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.avatar-container {
  cursor: pointer;
}

.avatar-hover {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.avatar-hover:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
