import { supabase } from "@/lib/supabaseClient";
import { defineStore } from "pinia";

export const useExamStore = defineStore("exam", {
  state: () => ({
    exams: [] as Exam[],
  }),
  actions: {
    async load() {
      const { data: exams, error } = await supabase
        .from("exams")
        .select("*, exam_types(title)")
        .order("date", { ascending: true });
      if (error) {
        console.error(error);
        return;
      }
      this.exams = exams;
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
  exam_types: { title: string };
}
