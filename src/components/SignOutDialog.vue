<template>
  <v-dialog v-model="show" :width="$vuetify.display.smAndDown ? '90%' : 'auto'">
    <v-card>
      <v-card-title class="text-body-1 text-sm-h6">Подтверждение</v-card-title>
      <v-card-text>Вы уверены, что хотите выйти?</v-card-text>
      <v-card-actions class="gap-2">
        <v-btn
          color="error"
          :size="$vuetify.display.smAndDown ? 'small' : 'default'"
          @click="confirmLogout"
        >
          Выйти
        </v-btn>
        <v-btn
          color="grey"
          :size="$vuetify.display.smAndDown ? 'small' : 'default'"
          @click="() => emit('update:show', false)"
        >
          Отмена
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { supabase } from "@/lib/supabaseClient";

const prop = defineProps<{
  show: boolean;
}>();
const { show } = toRefs(prop);

const emit = defineEmits(["update:show"]);

const confirmLogout = async () => {
  await supabase.auth.signOut();
  window.location.reload();
};
</script>
