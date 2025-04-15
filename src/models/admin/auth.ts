import { db } from "@/lib/db";

// Get Two-Factor Confirmation by User ID
export const getTwoFactorConfirmationByUserId = async (userId: string) => {
	try {
		const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
			where: {
				userId,
			},
		});
		return twoFactorConfirmation;
	} catch (error) {
		return null;
	}
};

// Get Password Reset Token by Token
export const getPasswordResetTokenByToken = async (token: string) => {
	try {
		const passwordResetToken = await db.passwordResetToken.findUnique({
			where: {
				token,
			},
		});
		return passwordResetToken;
	} catch (error) {
		return null;
	}
};

// Get Password Reset Token by Email
export const getPasswordResetTokenByEmail = async (email: string) => {
	try {
		const passwordResetToken = await db.passwordResetToken.findFirst({
			where: {
				email,
			},
		});
		return passwordResetToken;
	} catch (error) {
		return null;
	}
};

// get two factor token by token
export const getTwoFactorTokenByToken = async (token: string) => {
	try {
		const twoFactorToken = await db.twoFactorToken.findUnique({
			where: {
				token,
			},
		});
		return twoFactorToken;
	} catch (error) {
		return null;
	}
};

// get two factor token by email
export const getTwoFactorTokenByEmail = async (email: string) => {
	try {
		const twoFactorToken = await db.twoFactorToken.findFirst({
			where: {
				email,
			},
		});
		return twoFactorToken;
	} catch (error) {
		return null;
	}
};

// get verification token by Email
export const getVerificationTokenByEmail = async (email: string) => {
	try {
		const verificationToken = await db.verificationToken.findFirst({
			where: { email },
		});

		return verificationToken;
	} catch {
		return null;
	}
};

// get verification token by token
export const getVerificationTokenByToken = async (token: string) => {
	try {
		const verificationToken = await db.verificationToken.findUnique({
			where: {
				token,
			},
		});
		return verificationToken;
	} catch (error) {
		return null;
	}
};
