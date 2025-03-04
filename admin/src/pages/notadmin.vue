<template>
  <v-empty-state
    icon="mdi-account-off"
    title="Доступ запрещен"
    text="Вы не являетесь администратором"
    action-text="Выйти"
    @click:action="logout"
  />
</template>

<script lang="ts" setup>
import { supabase } from "@/lib/supabaseClient";

const router = useRouter();

const logout = async () => {
  await supabase.auth.signOut();
  router.push("/");
};
</script>
