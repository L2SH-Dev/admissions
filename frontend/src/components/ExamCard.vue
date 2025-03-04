<template>
  <v-container>
    <v-card :class="{ 'registered-border': registered }">
      <v-card-item>
        <v-row align="center" no-gutters justify="space-between">
          <v-col cols="12" sm="6">
            <div class="text-h6 mb-1">{{ capitalizedTitle }}</div>
            <div class="text-subtitle-1">
              <v-icon icon="mdi-school" class="mr-2" />
              <span>{{ data.grade }} класс</span>
            </div>
          </v-col>
          <v-col class="d-flex justify-end mt-2 mb-2">
            <v-btn
              v-if="!registered"
              color="primary"
              variant="tonal"
              :loading="isRegistering"
              :disabled="registeredSameType"
              @click="register"
            >
              {{ registeredSameType ? "Выбран другой слот" : "Записаться" }}
            </v-btn>
            <v-btn
              v-if="registered && canCancel"
              color="error"
              variant="tonal"
              :loading="isUnregistering"
              @click="unregister"
            >
              Отказаться
            </v-btn>
            <v-btn
              v-if="registered && new Date(data.date) < new Date()"
              color="info"
              variant="tonal"
              disabled
            >
              Результат
            </v-btn>
          </v-col>
        </v-row>
      </v-card-item>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <div class="d-flex align-center mb-2">
              <v-icon icon="mdi-calendar" class="mr-2" />
              <span>{{ formattedDate }}</span>
            </div>
            <div class="d-flex align-center mb-2">
              <v-icon icon="mdi-clock-outline" class="mr-2" />
              <span>
                {{ data.start_time.slice(0, -3) }} -
                {{ data.end_time.slice(0, -3) }}
              </span>
            </div>
          </v-col>
          <v-col sm="6">
            <div class="d-flex flex-column">
              <div class="d-flex align-center mb-1">
                <v-icon icon="mdi-account-group" class="mr-2" />
                <span>
                  {{
                    allocation === null
                      ? "..."
                      : `${allocation}/${data.capacity}`
                  }}
                  мест
                </span>
              </div>
              <v-progress-linear
                v-if="allocation !== null"
                :model-value="(allocation / data.capacity) * 100"
                :color="progressColor"
                height="8"
              />
              <v-progress-linear v-else indeterminate />
            </div>
          </v-col>
        </v-row>
        <p
          class="pl-4 mt-2"
          style="border-left: 3px solid rgb(var(--v-theme-info))"
        >
          {{ data.annotation }}
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { supabase } from "@/lib/supabaseClient";
import { useExamStore, type Exam } from "@/stores/exam";
import { useProfileStore } from "@/stores/profile";

const props = defineProps<{
  data: Exam;
}>();

const profileStore = useProfileStore();
const examStore = useExamStore();

const loading = ref(false);
const allocation = ref<number | null>(null);
const registered = ref(false);
const isRegistering = ref(false);
const isUnregistering = ref(false);
const registeredSameType = ref(false);

onMounted(() => {
  load();
});

watch(
  () => examStore.updateTrigger,
  () => {
    load();
  }
);

const load = async () => {
  loading.value = true;
  await Promise.all([
    loadRegistrationStatus(),
    loadRegisteredSameType(),
    loadAllocation(),
  ]);
  loading.value = false;
};

const capitalizedTitle = computed(() => {
  return (
    props.data.exam_types.title.charAt(0).toUpperCase() +
    props.data.exam_types.title.slice(1)
  );
});

const canCancel = computed(() => {
  return new Date(props.data.date) > new Date();
});

const formattedDate = computed(() => {
  return new Date(props.data.date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const progressColor = computed(() => {
  if (allocation.value === null) return "primary";
  const ratio = allocation.value / props.data.capacity;
  if (ratio >= 0.9) return "error";
  if (ratio >= 0.7) return "warning";
  return "success";
});

const loadRegistrationStatus = async () => {
  if (!profileStore.profile) return;
  const { data: exam_registration, error } = await supabase
    .from("exam_registrations")
    .select("*")
    .eq("exam_id", props.data.id)
    .eq("profile_id", profileStore.profile.id);

  if (error) {
    console.error(error);
  } else if (exam_registration.length) {
    registered.value = true;
  } else {
    registered.value = false;
  }
};

const loadRegisteredSameType = async () => {
  if (!profileStore.profile) return;
  const { data, error } = await supabase
    .from("exam_registrations")
    .select("*, exams(exam_type_id)")
    .eq("profile_id", profileStore.profile.id)
    .eq("exams.exam_type_id", props.data.exam_type_id);

  if (error) {
    console.error(error);
  } else {
    registeredSameType.value = data.length > 0;
  }
};

const loadAllocation = async () => {
  const { data, error } = await supabase.rpc("get_allocation", {
    e_id: props.data.id,
  });
  if (error) console.error(error);
  else allocation.value = data;
};

const register = async () => {
  if (!profileStore.profile) return;

  isRegistering.value = true;
  const { error } = await supabase
    .from("exam_registrations")
    .insert([{ profile_id: profileStore.profile.id, exam_id: props.data.id }])
    .select();

  if (error) {
    console.error(error);
  } else {
    examStore.update();
  }
  isRegistering.value = false;
};

const unregister = async () => {
  if (!profileStore.profile) return;

  isUnregistering.value = true;
  const { error } = await supabase
    .from("exam_registrations")
    .delete()
    .eq("profile_id", profileStore.profile.id)
    .eq("exam_id", props.data.id);

  if (error) {
    console.error(error);
  } else {
    examStore.update();
  }
  isUnregistering.value = false;
};
</script>

<style scoped>
.registered-border {
  border-left: 6px solid rgb(var(--v-theme-success)) !important;
}
</style>
