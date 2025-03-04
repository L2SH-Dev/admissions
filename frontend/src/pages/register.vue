<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card
      v-if="!finished"
      class="pa-5"
      max-width="500"
      width="100%"
      :loading="loading"
    >
      <v-card-title>
        <v-btn icon color="grey" to="/" variant="text">
          <v-icon>mdi-arrow-left</v-icon>
          Назад
        </v-btn>
        <h1 class="text-center flex-grow-1">Регистрация</h1>
      </v-card-title>
      <v-form ref="form" @submit.prevent="">
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          :rules="[rules.required, rules.email]"
        />
        <v-text-field
          v-model="password"
          label="Пароль"
          :type="passwordVisible ? 'text' : 'password'"
          :rules="[
            rules.required,
            rules.passwordLength,
            rules.passwordUppercase,
            rules.passwordLowercase,
            rules.passwordNumber,
            rules.passwordSpecial,
            rules.passwordNoCyrillic,
          ]"
        >
          <template #append-inner>
            <v-icon @click="passwordVisible = !passwordVisible">
              {{ passwordVisible ? "mdi-eye-off" : "mdi-eye" }}
            </v-icon>
          </template>
        </v-text-field>
        <v-text-field
          v-model="passwordConfirmation"
          label="Подтвердите пароль"
          type="password"
          :rules="[rules.required, rules.passwordMatch]"
        />
        <v-btn
          color="primary"
          type="submit"
          class="mt-4 mx-auto d-block"
          :disabled="loading"
          @click="signup"
        >
          Зарегистрироваться
        </v-btn>
      </v-form>
      <v-card-actions>
        <v-btn
          color="secondary"
          to="/login"
          class="mt-4 mx-auto"
          variant="text"
        >
          Уже есть аккаунт? Войти
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else elevation="0">
      <v-card-title>Подтверждение регистрации</v-card-title>
      <v-card-text>
        <v-alert variant="tonal" type="success">
          <p>
            На почту <strong>{{ email }}</strong> отправлено письмо с
            подтверждением.
          </p>
          <p>
            Пожалуйста, перейдите по ссылке в письме для завершения регистрации.
          </p>
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
  <v-snackbar v-model="errorSnackbar" :timeout="5000" color="error">
    {{ errorText }}
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { VForm } from "vuetify/components";
import { supabase } from "@/lib/supabaseClient";

export default defineComponent({
  data() {
    return {
      email: "",
      password: "",
      passwordVisible: false,
      passwordConfirmation: "",
      rules: {
        required: (v: string) => !!v || "Обязательное поле",
        email: (v: string) =>
          /.+@.+\..+/.test(v) || "Email должен быть действительным",
        passwordLength: (v: string) =>
          v.length >= 12 || "Пароль должен содержать не менее 12 символов",
        passwordUppercase: (v: string) =>
          /[A-Z]/.test(v) ||
          "Пароль должен содержать хотя бы одну заглавную букву",
        passwordLowercase: (v: string) =>
          /[a-z]/.test(v) ||
          "Пароль должен содержать хотя бы одну строчную букву",
        passwordNumber: (v: string) =>
          /[0-9]/.test(v) || "Пароль должен содержать хотя бы одну цифру",
        passwordSpecial: (v: string) =>
          /[-_|<>~!@#$%^&*(){}]/.test(v) ||
          "Пароль должен содержать хотя бы один спецсимвол",
        passwordNoCyrillic: (v: string) =>
          !/[а-яА-ЯёЁ]/.test(v) ||
          "Пароль не должен содержать кириллические буквы",
        passwordMatch: () =>
          this.passwordConfirmation === this.password || "Пароли не совпадают",
      },
      errorSnackbar: false,
      errorText: "",
      loading: false,
      finished: false,
    };
  },
  methods: {
    async signup() {
      const isValid = await (this.$refs.form as VForm).validate();
      if (!isValid.valid) return;

      this.loading = true;

      const { error } = await supabase.auth.signUp({
        email: this.email,
        password: this.password,
        options: {
          emailRedirectTo: window.location.origin + "/login",
        },
      });

      this.loading = false;

      if (error) {
        this.errorText = error.message;
        this.errorSnackbar = true;
      } else {
        this.finished = true;
      }
    },
  },
});
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
