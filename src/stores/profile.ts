// Utilities
import { defineStore } from "pinia";

export const useProfileStore = defineStore("profile", {
  persist: true,
  state: () => ({
    profile: null as Profile | null,
  }),
  actions: {
    setProfile(profile: Profile) {
      this.profile = profile;
    },
    clearProfileID() {
      this.profile = null;
    },
  },
});

export interface Profile {
  id: string;
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
