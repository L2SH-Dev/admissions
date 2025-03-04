<template>
  <v-form ref="form" @submit.prevent="handleSubmit">
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="formattedSelectedDate"
          label="Дата проведения"
          prepend-icon="mdi-calendar"
          :rules="[(v: string) => !!selectedDate || 'Выберите дату']"
          :active="datePickerDialog"
          readonly
        >
          <v-dialog v-model="datePickerDialog" activator="parent" width="auto">
            <v-date-picker
              v-if="datePickerDialog"
              v-model="selectedDate"
              title="Дата проведения"
              required
              :min="new Date()"
            />
          </v-dialog>
        </v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="start"
          label="Начало экзамена"
          prepend-icon="mdi-clock-time-ten-outline"
          placeholder="ЧЧ:ММ"
          clearable
          :rules="[
            (v: string) => !!v || 'Выберите время начала',
            (v: string) =>
              /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(v) ||
              'Неверный формат времени (ЧЧ:ММ)',
            (v: string) =>
              isStartTimeValid ||
              'Время начала должно быть раньше времени окончания'
          ]"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="end"
          label="Конец экзамена"
          prepend-icon="mdi-clock-time-three-outline"
          placeholder="ЧЧ:ММ"
          clearable
          :rules="[
            (v: string) => !!v || 'Выберите время окончания',
            (v: string) =>
              /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(v) ||
              'Неверный формат времени (ЧЧ:ММ)',
            (v: string) =>
              isEndTimeValid ||
              'Время окончания должно быть позже времени начала'
          ]"
        />
      </v-col>
    </v-row>

    <v-text-field
      v-model.number="formCapacity"
      label="Количество мест"
      type="number"
      min="1"
      max="999"
      :rules="[
        (v: number) => !!v || 'Введите количество мест',
        (v: number) => v > 0 || 'Количество мест должно быть больше 0',
        (v: number) => v <= 999 || 'Максимальное количество мест - 999',
        (v: number) =>
          Number.isInteger(v) || 'Количество мест должно быть целым числом'
      ]"
      required
    />

    <v-select
      v-model="formGrade"
      :items="grades"
      label="Класс"
      :rules="[(v: number) => !!v || 'Выберите класс']"
      required
    />

    <v-select
      v-model="formTypeId"
      :loading="examTypes.length < 1"
      :disabled="examTypes.length < 1"
      :items="examTypes"
      item-title="title"
      item-value="id"
      label="Тип экзамена"
      :rules="[(v: number) => !!v || 'Выберите тип экзамена']"
      required
    />

    <v-row>
      <v-col cols="12">
        <v-select
          v-model="selectedPredefinedAnnotation"
          :items="predefinedAnnotations"
          label="Сообщение"
          :rules="[(v: string) => !!v || 'Выберите сообщение']"
          required
          hide-details
        >
          <template #item="{ props, item }">
            <v-list-item v-bind="props" title="">
              <v-list-item-title class="text-wrap">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-select>
      </v-col>
      <v-col v-if="showCustomAnnotation" class="pd-0">
        <v-textarea
          v-model="formAnnotation"
          class="pd-0"
          label="Введите сообщение"
          :rules="[(v: string) => !!v || 'Введите сообщение']"
          required
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-switch
          v-model="registrationIsOpen"
          :label="
            registrationIsOpen ? 'Регистрация открыта' : 'Регистрация закрыта'
          "
          color="primary"
          :messages="['По умолчанию регистрация открыта']"
          hide-details
        />
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col class="text-right">
        <v-btn type="submit" color="primary"> Создать экзамен </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { supabase } from "@/lib/supabaseClient";
import type { VForm } from "vuetify/components";

interface ExamType {
  id: number;
  title: string;
}

export default defineComponent({
  name: "ExamForm",
  emits: ["update"],
  data() {
    return {
      // Date and time fields
      selectedDate: null as string | null,
      datePickerDialog: false,
      start: "10:00",
      end: "12:00",

      // Annotation fields
      selectedPredefinedAnnotation: null as string | null,
      predefinedAnnotations: [
        "Сбор в холле нового здания за 30 минут до начала экзамена. Возьмите ручки!",
        "Сбор в холле старого здания за 30 минут до начала экзамена. Возьмите ручки!",
        "Другое",
      ],
      formAnnotation: "",

      // Other form fields
      formCapacity: 30,
      formGrade: 6,
      grades: [6, 7, 8, 9, 10, 11],
      examTypes: [] as ExamType[],
      formTypeId: 0,
      registrationIsOpen: true,
    };
  },
  computed: {
    formattedSelectedDate(): string {
      return this.selectedDate
        ? new Date(this.selectedDate).toLocaleDateString("ru-RU")
        : "";
    },
    showCustomAnnotation(): boolean {
      return this.selectedPredefinedAnnotation === "Другое";
    },
    isStartTimeValid(): boolean {
      if (!this.start || !this.end) return true;
      return (
        this.parseTimeToMinutes(this.start) < this.parseTimeToMinutes(this.end)
      );
    },
    isEndTimeValid(): boolean {
      if (!this.start || !this.end) return true;
      return (
        this.parseTimeToMinutes(this.end) > this.parseTimeToMinutes(this.start)
      );
    },
  },
  watch: {
    selectedPredefinedAnnotation(newVal: string | null) {
      if (newVal && newVal !== "Другое") {
        this.formAnnotation = newVal;
      } else {
        this.formAnnotation = "";
      }
    },
  },
  mounted() {
    this.loadExamTypes();
  },
  methods: {
    parseTimeToMinutes(time: string): number {
      if (!time) return 0;
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    },
    async loadExamTypes() {
      const { data: exam_types, error } = await supabase
        .from("exam_types")
        .select("id,title");
      if (error) {
        console.error("Error loading exam types:", error);
        return;
      }
      this.examTypes = exam_types || [];
      if (this.examTypes.length > 0) {
        this.formTypeId = this.examTypes[0].id;
      }
    },
    async handleSubmit() {
      // Access the form via $refs (the <v-form ref="form" /> in the template)
      const form = this.$refs.form as VForm;
      if (!form) return;

      const isValid = await form.validate();
      if (!isValid.valid) return;

      // Assuming formattedSelectedDate is in "dd.mm.yyyy" format
      const parts = this.formattedSelectedDate.split(".");
      if (parts.length !== 3) {
        console.error("Invalid date format");
        return;
      }
      const [day, month, year] = parts;

      const { data, error } = await supabase
        .from("exams")
        .insert([
          {
            date: `${year}-${month}-${day}`,
            start_time: this.start,
            end_time: this.end,
            capacity: this.formCapacity,
            grade: this.formGrade,
            exam_type_id: this.formTypeId,
            registration_is_open: this.registrationIsOpen,
            annotation: this.formAnnotation,
          },
        ])
        .select();

      if (error) {
        console.error("Error creating an exam:", error);
      } else {
        console.info("Exam created:", data);
        this.$emit("update");
      }
    },
  },
});
</script>
