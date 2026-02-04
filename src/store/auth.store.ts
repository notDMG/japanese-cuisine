import { Session } from "next-auth";
import { create } from "zustand";

type SessionStatus = "autheticated" | "unautheticated" | "loading";

interface AuthState {
  isAuth: boolean;
  status: SessionStatus;
  session: Session | null;
  setAuthState: (status: SessionStatus, session: Session | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: false,
  status: 'unautheticated',
  session: null,
  setAuthState: (status: SessionStatus, session: Session | null) => 
    set({
      isAuth: status === 'autheticated',
      status,
      session
    })
}))