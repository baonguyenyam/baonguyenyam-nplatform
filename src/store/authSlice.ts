import type { UserRole } from "@prisma/client";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
	id: string;
	email: string;
	name?: string | null;
	role: UserRole;
	avatar?: string | null;
	permissions?: string[];
	isTwoFactorEnabled?: boolean;
}

interface AuthState {
	isLoggedIn: boolean;
	user: AuthUser | null;
	isLoading: boolean;
	lastSync: number | null; // Timestamp of last sync with NextAuth
}

const initialState: AuthState = {
	isLoggedIn: false,
	user: null,
	isLoading: false,
	lastSync: null,
};

const authSlice = createSlice({
	name: "authState",
	initialState,
	reducers: {
		setAuthLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		setActiveUser: (state, action: PayloadAction<AuthUser>) => {
			state.isLoggedIn = true;
			state.user = action.payload;
			state.isLoading = false;
			state.lastSync = Date.now();
		},
		updateUserProfile: (state, action: PayloadAction<Partial<AuthUser>>) => {
			if (state.user) {
				state.user = { ...state.user, ...action.payload };
				state.lastSync = Date.now();
			}
		},
		removeActiveUser: (state) => {
			state.isLoggedIn = false;
			state.user = null;
			state.isLoading = false;
			state.lastSync = Date.now();
		},
		syncFromNextAuth: (
			state,
			action: PayloadAction<{ user: AuthUser | null; isLoggedIn: boolean }>,
		) => {
			const { user, isLoggedIn } = action.payload;
			state.isLoggedIn = isLoggedIn;
			state.user = user;
			state.isLoading = false;
			state.lastSync = Date.now();
		},
	},
});

export const {
	setAuthLoading,
	setActiveUser,
	updateUserProfile,
	removeActiveUser,
	syncFromNextAuth,
} = authSlice.actions;

// Selectors
export const selectAuth = (state: { authState: AuthState }) => state.authState;
export const selectAuthUser = (state: { authState: AuthState }) =>
	state.authState.user;
export const selectIsLoggedIn = (state: { authState: AuthState }) =>
	state.authState.isLoggedIn;
export const selectAuthLoading = (state: { authState: AuthState }) =>
	state.authState.isLoading;

export default authSlice.reducer;
