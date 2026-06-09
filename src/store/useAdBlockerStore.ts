import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdBlockerState {
  isAdBlockerActive: boolean;
  codeVerified: boolean;
  verifyCode: (code: string) => boolean;
  deactivateAdBlocker: () => void;
}

const ADBLOCKER_CODE = import.meta.env.VITE_ADBLOCKER_CODE || 'iaugbfh89aunb3i9h8';

export const useAdBlockerStore = create<AdBlockerState>()(
  persist(
    (set) => ({
      isAdBlockerActive: false,
      codeVerified: false,
      verifyCode: (code: string) => {
        const isValid = code === ADBLOCKER_CODE;
        if (isValid) {
          set({ isAdBlockerActive: true, codeVerified: true });
        }
        return isValid;
      },
      deactivateAdBlocker: () => {
        set({ isAdBlockerActive: false, codeVerified: false });
      },
    }),
    {
      name: 'adblocker-storage',
    }
  )
);
