import { supabase } from "@/lib/supabaseClient";
import { defineStore } from "pinia";

export const useProfileStore = defineStore("profile", {
  state: () => ({
    pendingCount: 0,
    approvedCount: 0,
    loadingPending: false,
    loadingApproved: false,
    pendingPage: [] as Profile[],
    approvedPage: [] as Profile[],
  }),
  actions: {
    async countPending() {
      const { data: count, error } = await supabase
        .from("profiles")
        .select("count", { count: "exact" })
        .neq("approved", true);
      if (error) {
        console.error(error);
        return;
      }
      this.pendingCount = count[0].count;
    },
    async countApproved() {
      const { data: count, error } = await supabase
        .from("profiles")
        .select("count", { count: "exact" })
        .eq("approved", true);
      if (error) {
        console.error(error);
        return;
      }
      this.approvedCount = count[0].count;
    },
    async loadPending(page: number, pageSize: number) {
      this.loadingPending = true;
      this.countPending();
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("approved", true)
        .order("created_at", { ascending: true })
        .range(page * pageSize, (page + 1) * pageSize - 1);
      if (error) {
        console.error(error);
        return;
      }
      this.pendingPage = profiles;
      this.loadingPending = false;
    },
    async loadApproved(page: number, pageSize: number) {
      this.loadingApproved = true;
      this.countApproved();
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: true })
        .range(page * pageSize, (page + 1) * pageSize - 1);
      if (error) {
        console.error(error);
        return;
      }
      this.approvedPage = profiles;
      this.loadingApproved = false;
    },
  },
});

export interface Profile {
  id: string;
  user_id: string;
  approved: boolean;
  birth_date: string;
  created_at: string;
  first_name: string;
  last_name: string;
  patronymic: string | null;
  gender: string | null;
  grade: number;
  old_school: string;
  parent_first_name: string;
  parent_last_name: string;
  parent_patronymic: string | null;
  parent_phone: string;
  source: string;
  june_exam: boolean;
  vmsh: boolean;
  avatar: string;
}
