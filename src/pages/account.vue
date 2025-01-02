<template>
  {{ email }}
  Email confirmed: {{ emailConfirmed }}
</template>

<script lang="ts" setup>
import { supabase } from "@/lib/supabaseClient";
import { onMounted, ref } from "vue";

const email = ref("");
const emailConfirmed = ref(false);

onMounted(async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);

  if (user) {
    email.value = user.email ?? "";
    emailConfirmed.value = user.email_confirmed_at !== null;
  }
});
</script>
