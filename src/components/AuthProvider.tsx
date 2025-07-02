"use client";

import { useAuthSync } from "@/hooks/auth/useAuthSync";

/**
 * AuthProvider để tự động sync NextAuth với Redux
 * Đặt component này trong layout để đảm bảo auth state luôn được sync
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
	// Hook này sẽ tự động sync NextAuth session với Redux
	useAuthSync();

	return <>{children}</>;
}
