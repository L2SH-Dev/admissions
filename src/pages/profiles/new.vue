<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-5" width="700">
      <v-card-title>
        <v-btn
          icon
          color="grey"
          variant="text"
          @click="() => $router.push('/profiles')"
        >
          <v-icon>mdi-arrow-left</v-icon>
          Назад
        </v-btn>
        <h2 class="text-center flex-grow-1 text-wrap">
          Регистрация поступающего
        </h2>
      </v-card-title>
      <v-form ref="form" @submit.prevent="handleSubmit">
        <v-text-field
          v-model="last_name"
          label="Фамилия поступающего"
          :rules="[rules.required]"
        />
        <v-text-field
          v-model="first_name"
          label="Имя поступающего"
          :rules="[rules.required]"
        />
        <v-text-field v-model="patronymic" label="Отчество поступающего" />
        <v-select
          v-model="gender"
          :items="['Мужской', 'Женский']"
          label="Пол"
          :rules="[rules.required]"
        />
        <v-date-picker
          v-model="birth_date"
          title="Дата рождения поступающего"
          width="70%"
          min-width="300px"
          :rules="[rules.required]"
          :max="maxDate"
          :min="minDate"
        />
        <v-select
          v-model="grade"
          :items="[6, 7, 8, 9, 10, 11]"
          label="В какой класс вы хотите поступить?"
          :rules="[rules.required]"
        />
        <v-text-field
          v-model="old_school"
          label="В какой школе вы учитесь сейчас?"
          :rules="[rules.required]"
        />
        <v-text-field
          v-model="parent_last_name"
          label="Фамилия родителя"
          :rules="[rules.required]"
        />
        <v-text-field
          v-model="parent_first_name"
          label="Имя родителя"
          :rules="[rules.required]"
        />
        <v-text-field v-model="parent_patronymic" label="Отчество родителя" />
        <v-text-field
          v-model="parent_phone"
          label="Телефон родителя"
          hint="Формат: +79160000000"
          :rules="[rules.required, rules.phone]"
        />
        <span>
          Отметьте этот пункт, если поступающий проживает не в Москве или
          Московской области и хочет сдавать экзамены в июне.
        </span>
        <v-checkbox v-model="june_exam" label="Экзамены в июне" />
        <span>
          Посещали ли вы занятия Вечерней Математической Школы Л2Ш в текущем
          учебном году?
        </span>
        <v-checkbox v-model="vmsh" label="Да" />
        <span>Ответьте, пожалуйста, как Вы узнали о Лицее "Вторая школа"?</span>
        <v-select
          v-model="selectedPredefinedSource"
          label="Источник"
          :items="predefinedSources"
          :rules="[(v) => !!v || 'Выберите источник']"
          required
          class="mt-4"
        />
        <v-text-field
          v-if="showCustomSource"
          v-model="source"
          label="Введите источник"
          :rules="[(v) => !!v || 'Введите источник']"
          required
        />
        <AvatarUpload
          :size="100"
          class="mb-4 mt-2"
          @change:file="avatar = $event"
        />
        <v-checkbox
          :rules="[(v) => !!v || 'Необходимо ознакомиться с положением']"
        >
          <template #label>
            <span>
              Ознакомлен с
              <a href="#" @click.prevent="openRulesDialog">
                Положением о приеме в ГБОУ Лицей "Вторая школа"
              </a>
            </span>
          </template>
        </v-checkbox>
        <v-dialog v-model="rulesDialog" fullscreen>
          <v-card>
            <v-card-title>Положение о приеме</v-card-title>
            <Regulations />
            <v-card-actions>
              <v-btn
                color="primary"
                variant="text"
                @click="rulesDialog = false"
              >
                Закрыть
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-checkbox
          v-model="personalDataConsent"
          :rules="[rules.consent]"
          required
          label="Согласен на обработку персональных данных"
        />

        <v-btn
          color="primary"
          type="submit"
          class="mt-4 mx-auto d-block"
          :loading="registering"
        >
          Зарегистрировать
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
  <v-snackbar v-model="errorSnackbar" :timeout="5000" color="error">
    {{ errorText }}
  </v-snackbar>
</template>

<script lang="ts">
import { supabase } from "@/lib/supabaseClient";
import { defineComponent } from "vue";
import { VForm } from "vuetify/components";

export default defineComponent({
  data() {
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 14);

    return {
      first_name: "",
      last_name: "",
      patronymic: "",
      gender: "", // 'Мужской' or 'Женский'
      birth_date: defaultDate,
      grade: 6, // 6, 7, 8, 9, 10, 11
      old_school: "",
      parent_first_name: "",
      parent_last_name: "",
      parent_patronymic: "",
      parent_phone: "",
      june_exam: false,
      vmsh: false,
      source: "",
      selectedPredefinedSource: null as string | null,
      predefinedSources: [
        "Здесь учился (учится) кто-то из моей семьи",
        "Нашел в рейтинге школ Москвы",
        "Порекомендовали друзья/знакомые",
        "Узнал из социальных сетей",
        "Другое",
      ],
      avatar: null as File | null,
      errorSnackbar: false,
      errorText: "",
      registering: false,
      finished: false,
      rulesDialog: false,
      personalDataConsent: false,
      rules: {
        required: (value: string) => !!value || "Обязательное поле.",
        phone: (value: string) =>
          /^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/.test(value) ||
          "Некорректный номер телефона.",
        consent: (value: boolean) =>
          value || "Вы должны согласиться на обработку данных.",
      },
    };
  },
  computed: {
    formattedGender(): string | null {
      if (this.gender === "Мужской") return "M";
      if (this.gender === "Женский") return "F";
      return null;
    },
    maxDate(): Date {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 9);
      return date;
    },
    minDate(): Date {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 18);
      return date;
    },
    showCustomSource(): boolean {
      return this.selectedPredefinedSource === "Другое";
    },
  },
  watch: {
    selectedPredefinedSource(newVal) {
      this.updateSource(newVal);
    },
  },
  methods: {
    async handleSubmit() {
      const isValid = await (this.$refs.form as VForm).validate();
      if (!isValid.valid) return;
      if (!this.checkAvatar()) return;

      this.registering = true;

      try {
        const avatar_path = await this.uploadAvatar();
        const { error } = await supabase
          .from("profiles")
          .insert([
            {
              first_name: this.first_name,
              last_name: this.last_name,
              patronymic: this.patronymic,
              gender: this.formattedGender,
              birth_date: this.birth_date,
              grade: this.grade,
              old_school: this.old_school,
              parent_first_name: this.parent_first_name,
              parent_last_name: this.parent_last_name,
              parent_patronymic: this.parent_patronymic,
              parent_phone: this.parent_phone,
              june_exam: this.june_exam,
              vmsh: this.vmsh,
              source: this.source,
              avatar: avatar_path,
            },
          ])
          .select();
        if (error) throw error;
        this.$router.push("/profiles");
      } catch (error) {
        this.errorText =
          error instanceof Error ? error.message : "Неизвестная ошибка";
        this.errorSnackbar = true;
      } finally {
        this.registering = false;
      }
    },
    updateSource(value: string | null) {
      if (!value || value === "Другое") {
        this.source = "";
      } else {
        this.source = value;
      }
    },
    openRulesDialog() {
      this.rulesDialog = true;
    },
    checkAvatar() {
      if (!this.avatar) {
        this.errorText = "Необходимо загрузить фото поступающего.";
        this.errorSnackbar = true;
        return false;
      }
      return true;
    },
    async uploadAvatar() {
      if (!this.avatar) return;

      const fileExt = this.avatar.name.split(".").pop();
      const filePath = `${Math.random()
        .toString(36)
        .substring(2)}${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, this.avatar);

      if (uploadError) throw uploadError;

      return filePath;
    },
  },
});
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
.top-left {
  position: absolute;
  top: 16px;
  left: 16px;
}
</style>
