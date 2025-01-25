<template>
  <v-container>
    <v-card :disabled="loading" :loading="loading">
      <v-card-title class="mb-2">
        <v-icon v-if="exam.registration_is_open" color="success">
          mdi-lock-open
        </v-icon>
        <v-icon v-else color="error">mdi-lock</v-icon>
        {{ capitalizedTitle }}
      </v-card-title>

      <v-card-text class="pb-0">
        <v-row>
          <v-col cols="12" sm="6">
            <div class="d-flex align-center mb-2">
              <v-icon icon="mdi-calendar" class="mr-2" />
              <span>{{ formattedDate }}</span>
            </div>
            <div class="d-flex align-center mb-2">
              <v-icon icon="mdi-clock-outline" class="mr-2" />
              <span>
                {{ exam.start_time.slice(0, 5) }} -
                {{ exam.end_time.slice(0, 5) }}
              </span>
            </div>
          </v-col>
          <v-col cols="12" sm="6">
            <div class="d-flex align-center">
              <v-icon icon="mdi-school" class="mr-2" />
              <span>{{ exam.grade }} класс</span>
            </div>
            <div class="d-flex flex-column mb-2">
              <div class="d-flex align-center mb-1">
                <v-icon icon="mdi-account-group" class="mr-2" />
                <span>
                  {{
                    allocation === null
                      ? "..."
                      : `${allocation}/${exam.capacity}`
                  }}
                  мест
                </span>
              </div>
              <v-progress-linear
                v-if="allocation !== null"
                :model-value="(allocation / exam.capacity) * 100"
                :color="progressColor"
                height="8"
              />
              <v-progress-linear v-else indeterminate />
            </div>
          </v-col>
        </v-row>
        <p>{{ exam.annotation }}</p>

        <v-switch
          v-model="registration_is_open"
          :label="
            registration_is_open ? 'Регистрация открыта' : 'Регистрация закрыта'
          "
          color="primary"
          hide-details
          @change="updateRegistrationStatus"
        />
      </v-card-text>

      <!-- <v-btn
        color="primary"
        :icon="$vuetify.display.xs"
        variant="tonal"
        @click="store.load"
      >
        <v-icon>mdi-refresh</v-icon>
        <span class="d-none d-sm-inline ml-2">Обновить</span>
      </v-btn> -->

      <v-card-actions class="d-flex justify-end">
        <v-btn
          color="primary"
          variant="text"
          :icon="$vuetify.display.xs"
          @click="editExam"
        >
          <v-icon>mdi-pencil</v-icon>
          <span class="d-none d-sm-inline ml-2">Редактировать</span>
        </v-btn>
        <v-btn
          color="error"
          variant="text"
          :icon="$vuetify.display.xs"
          @click="deleteExam"
        >
          <v-icon>mdi-delete</v-icon>
          <span class="d-none d-sm-inline ml-2">Удалить</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>

  <v-dialog v-model="deleteDialog" width="auto">
    <v-card>
      <v-card-title>Подтверждение удаления</v-card-title>
      <v-card-text>Вы уверены, что хотите удалить этот экзамен?</v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="confirmDelete">Удалить</v-btn>
        <v-btn color="grey" variant="text" @click="deleteDialog = false">
          Отмена
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { supabase } from "@/lib/supabaseClient";
import type { Exam } from "@/stores/exam";

const props = defineProps<{
  exam: Exam;
}>();

const emit = defineEmits(["update"]);

const deleteDialog = ref(false);
const allocation = ref<null | number>(null);
const registration_is_open = ref(props.exam.registration_is_open);
const loading = ref(false);

const capitalizedTitle =
  props.exam.exam_types.title.charAt(0).toUpperCase() +
  props.exam.exam_types.title.slice(1);

onMounted(() => {
  loadAllocation();
});

const formattedDate = new Date(props.exam.date).toLocaleDateString("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const progressColor = computed(() => {
  if (allocation.value === null) return "primary";
  const ratio = allocation.value / props.exam.capacity;
  if (ratio >= 0.9) return "error";
  if (ratio >= 0.7) return "warning";
  return "success";
});

const deleteExam = () => {
  deleteDialog.value = true;
};

const editExam = () => {
  console.log("edit");
};

const confirmDelete = async () => {
  loading.value = true;
  const { error } = await supabase
    .from("exams")
    .delete()
    .eq("id", props.exam.id);
  if (error) console.error(error);
  else emit("update");
  loading.value = false;
};

const updateRegistrationStatus = async () => {
  loading.value = true;
  const { error } = await supabase
    .from("exams")
    .update({ registration_is_open: registration_is_open.value })
    .eq("id", props.exam.id);
  if (error) console.error(error);
  else emit("update");
  loading.value = false;
};

const loadAllocation = async () => {
  const { data, error } = await supabase.rpc("get_allocation", {
    e_id: props.exam.id,
  });
  if (error) console.error(error);
  else allocation.value = data;
};
</script>
