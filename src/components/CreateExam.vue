<template>
  <v-form ref="form" @submit.prevent="handleSubmit">
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="formattedSelectedDate"
          label="Дата проведения"
          prepend-icon="mdi-calendar"
          :rules="[(v) => !!selectedDate || 'Выберите дату']"
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
              'Время начала должно быть раньше времени окончания',
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
              'Время окончания должно быть позже времени начала',
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
        (v) => !!v || 'Введите количество мест',
        (v) => v > 0 || 'Количество мест должно быть больше 0',
        (v) => v <= 999 || 'Максимальное количество мест - 999',
        (v) =>
          Number.isInteger(v) || 'Количество мест должно быть целым числом',
      ]"
      required
    />

    <v-select
      v-model="formGrade"
      :items="grades"
      label="Класс"
      :rules="[(v) => !!v || 'Выберите класс']"
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
      :rules="[(v) => !!v || 'Выберите тип экзамена']"
      required
    />

    <v-row>
      <v-col cols="12">
        <v-select
          v-model="selectedPredefinedAnnotation"
          :items="predefinedAnnotations"
          label="Сообщение"
          :rules="[(v) => !!v || 'Выберите сообщение']"
          required
          hide-details
        >
          <template #item="{ props, item }">
            <v-list-item v-bind="props" title="">
              <v-list-item-title class="text-wrap">
                {{ item.raw }}
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

<script lang="ts" setup>
import { supabase } from "@/lib/supabaseClient";
import { ref, computed, watch, onMounted } from "vue";
import type { VForm } from "vuetify/components";

interface ExamType {
  id: number;
  title: string;
}

const emit = defineEmits(["update"]);

// Form ref
const form = ref<VForm | null>(null);

// Date and time fields
const selectedDate = ref<string | null>(null);
const datePickerDialog = ref(false);
const start = ref("10:00");
const end = ref("12:00");

// Annotation fields
const selectedPredefinedAnnotation = ref<string | null>(null);
const predefinedAnnotations = [
  "Сбор в холле нового здания за 30 минут до начала экзамена. Возьмите ручки!",
  "Сбор в холле старого здания за 30 минут до начала экзамена. Возьмите ручки!",
  "Другое",
];
const formAnnotation = ref("");

// Other form fields
const formCapacity = ref(30);
const formGrade = ref(6);
const grades = [6, 7, 8, 9, 10, 11];
const examTypes = ref<ExamType[]>([]);
const formTypeId = ref(0);
const registrationIsOpen = ref(true);

// Computed properties
const formattedSelectedDate = computed(() => {
  return selectedDate.value
    ? new Date(selectedDate.value).toLocaleDateString("ru-RU")
    : "";
});

const showCustomAnnotation = computed(() => {
  return selectedPredefinedAnnotation.value === "Другое";
});

const parseTimeToMinutes = (time: string) => {
  if (!time) return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const isStartTimeValid = computed(() => {
  if (!start.value || !end.value) return true;
  return parseTimeToMinutes(start.value) < parseTimeToMinutes(end.value);
});

const isEndTimeValid = computed(() => {
  if (!start.value || !end.value) return true;
  return parseTimeToMinutes(end.value) > parseTimeToMinutes(start.value);
});

// Watchers
watch(selectedPredefinedAnnotation, (newVal) => {
  if (newVal && newVal !== "Другое") {
    formAnnotation.value = newVal;
  } else {
    formAnnotation.value = "";
  }
});

// Mock exam types loading
onMounted(async () => {
  const loadedTypes = await loadExamTypes();
  if (loadedTypes) {
    examTypes.value = loadedTypes;
    if (examTypes.value.length > 0) {
      formTypeId.value = examTypes.value[0].id;
    }
  }
});

const loadExamTypes = async () => {
  const { data: exam_types, error } = await supabase
    .from("exam_types")
    .select("id,title");
  if (error) {
    console.error("Error loading exam types:", error);
    return null;
  }
  return exam_types || [];
};

// Submit handler
const handleSubmit = async () => {
  const isValid = await form.value?.validate();
  if (!isValid?.valid) return;

  const [day, month, year] = formattedSelectedDate.value.split(".");

  const { data, error } = await supabase
    .from("exams")
    .insert([
      {
        date: `${year}-${month}-${day}`,
        start_time: start.value,
        end_time: end.value,
        capacity: formCapacity.value,
        grade: formGrade.value,
        exam_type_id: formTypeId.value,
        registration_is_open: registrationIsOpen.value,
        annotation: formAnnotation.value,
      },
    ])
    .select();

  if (error) console.error("Error creating an exam:", error);
  else {
    console.info("Exam created:", data);
    emit("update");
  }
};
</script>
