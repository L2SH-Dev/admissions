import { defineStore } from "pinia";
import { useProfileStore } from "@/stores/profile";
import { supabase } from "@/lib/supabaseClient";

export const useExamStore = defineStore("exam", {
  state: () => ({
    availableExams: [] as Exam[],
    historyExams: [] as Exam[],
    updateTrigger: false,
  }),
  actions: {
    update() {
      this.updateTrigger = !this.updateTrigger;
      this.loadAvailable();
      this.loadHistory();
    },
    async loadAvailable() {
      this.updateTrigger = !this.updateTrigger;
      const profileStore = useProfileStore();
      if (profileStore.profile == null) {
        this.availableExams = [];
        return;
      }

      const { data, error } = await supabase.rpc("get_available_exams", {
        profile_id: profileStore.profile.id,
      });
      if (error) {
        console.error(error);
        this.availableExams = [];
      } else if (data) {
        const availableExamsResponse = data as ExamsResponse[];
        this.availableExams = [availableExamsResponse].flat().map((exam) => {
          return {
            ...exam,
            exam_types: { title: exam.title },
          };
        });
      } else this.availableExams = [];
    },
    async loadHistory() {
      this.updateTrigger = !this.updateTrigger;
      const profileStore = useProfileStore();
      if (profileStore.profile == null) {
        this.historyExams = [];
        return;
      }

      const { data, error } = await supabase.rpc("get_history_exams", {
        profile_id: profileStore.profile.id,
      });
      if (error) {
        console.error(error);
        this.historyExams = [];
      } else if (data) {
        const historyExamsResponse = data as ExamsResponse[];
        this.historyExams = [historyExamsResponse].flat().map((exam) => {
          return {
            ...exam,
            exam_types: { title: exam.title },
          };
        });
      } else this.historyExams = [];
    },
  },
});

export interface Exam {
  id: string;
  created_at: string;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  grade: string;
  registration_is_open: boolean;
  annotation: string | null;
  exam_type_id: string;
  exam_types: { title: string };
}

interface ExamsResponse {
  id: string;
  created_at: string;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  grade: string;
  registration_is_open: boolean;
  annotation: string | null;
  exam_type_id: string;
  title: string;
}
