import { db } from "@/lib/db";

// Get Setting by Slug
export const getSettingByKey = async (key: string) => {
	try {
		const setting = await db.setting.findFirst({
			where: {
				key,
			},
		});

		return setting;
	} catch (error) {
		return null;
	}
};

// Get all settings
export const getAllSettings = async () => {
	try {
		const settings = await db.setting.findMany();

		return settings;
	} catch (error) {
		return null;
	}
};

// update setting
export const updateSetting = async (data: any) => {
	try {
		for (const key in data) {
			const setting = await db.setting.findFirst({
				where: {
					key,
				},
			});
			if (setting) {
				await db.setting.update({
					where: {
						id: setting.id,
					},
					data: {
						value: data[key],
					},
				});
			}
		}
		const setting = await db.setting.findMany();
		return setting;
	} catch (error) {
		return null;
	}
};
