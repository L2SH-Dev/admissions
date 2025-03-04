<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-5" max-width="500" width="100%" :loading="loading">
      <v-card-title>
        <h1 class="text-center flex-grow-1">Вход</h1>
      </v-card-title>
      <v-form ref="form" @submit.prevent="">
        <v-text-field
          v-model="email"
          label="Email"
          :rules="[rules.required, rules.email]"
        />
        <v-text-field
          v-model="password"
          label="Пароль"
          :type="passwordVisible ? 'text' : 'password'"
          :rules="[rules.required]"
        >
          <template #append-inner>
            <v-icon @click="passwordVisible = !passwordVisible">
              {{ passwordVisible ? "mdi-eye-off" : "mdi-eye" }}
            </v-icon>
          </template>
        </v-text-field>
        <v-btn
          color="primary"
          type="submit"
          class="mt-4 mx-auto d-block"
          :disabled="loading"
          @click="login"
        >
          Войти
        </v-btn>
      </v-form>
      <v-card-actions>
        <v-btn
          color="secondary"
          to="/register"
          class="mt-4 mx-auto"
          variant="text"
        >
          Нет аккаунта? Зарегистрироваться
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
  <v-snackbar v-model="errorSnackbar" :timeout="5000" color="error">
    {{ errorText }}
  </v-snackbar>
</template>

<script lang="ts">
import { supabase } from "@/lib/supabaseClient";
import { defineComponent } from "vue";
import type { VForm } from "vuetify/components";

export default defineComponent({
  data() {
    return {
      email: "",
      password: "",
      passwordVisible: false,
      rules: {
        required: (v: string) => !!v || "Обязательное поле",
        email: (v: string) =>
          /.+@.+\..+/.test(v) || "Email должен быть действительным",
      },
      errorSnackbar: false,
      errorText: "",
      loading: false,
    };
  },
  methods: {
    async login() {
      const isValid = await (this.$refs.form as VForm).validate();
      if (!isValid.valid) return;

      this.loading = true;

      const { error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password,
      });

      this.loading = false;

      if (error) {
        this.errorText = error.message;
        this.errorSnackbar = true;
      } else {
        this.redirect();
      }
    },
    redirect() {
      if (this.$route.query.redirect)
        this.$router.push(this.$route.query.redirect as string);
      else this.$router.push("/profile");
    },
  },
});
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
