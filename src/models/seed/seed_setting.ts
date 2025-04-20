import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const SettingSeed = async () => {
	// Page
	const setting = await prisma.setting.findFirst({
		where: {
			key: "page",
		},
	});
	if (!setting) {
		await prisma.setting.create({
			data: {
				key: "page",
				value: "16",
			},
		});
	}
	const setting_tax = await prisma.setting.findFirst({
		where: {
			key: "tax",
		},
	});
	if (!setting_tax) {
		await prisma.setting.create({
			data: {
				key: "tax",
				value: "8.5",
			},
		});
	}
	const setting_bill_note = await prisma.setting.findFirst({
		where: {
			key: "bill_note",
		},
	});
	if (!setting_bill_note) {
		await prisma.setting.create({
			data: {
				key: "bill_note",
				value: "Thank you for your business!",
			},
		});
	}
	const setting_bill_logo = await prisma.setting.findFirst({
		where: {
			key: "bill_logo",
		},
	});
	if (!setting_bill_logo) {
		await prisma.setting.create({
			data: {
				key: "bill_logo",
				value: "/imgs/logo_black.png",
			},
		});
	}
	const setting_bill_company_name = await prisma.setting.findFirst({
		where: {
			key: "bill_company_name",
		},
	});
	if (!setting_bill_company_name) {
		await prisma.setting.create({
			data: {
				key: "bill_company_name",
				value: "Company Name",
			},
		});
	}
	const setting_bill_company_address = await prisma.setting.findFirst({
		where: {
			key: "bill_company_address",
		},
	});
	if (!setting_bill_company_address) {
		await prisma.setting.create({
			data: {
				key: "bill_company_address",
				value: "1234 Main St, City, State 12345",
			},
		});
	}
	const setting_bill_company_info = await prisma.setting.findFirst({
		where: {
			key: "bill_company_info",
		},
	});
	if (!setting_bill_company_info) {
		await prisma.setting.create({
			data: {
				key: "bill_company_info",
				value: "Tel: 123-456-7890 | Email: sale@demo.com",
			},
		});
	}
	const setting_order_key = await prisma.setting.findFirst({
		where: {
			key: "order_key",
		},
	});
	if (!setting_order_key) {
		await prisma.setting.create({
			data: {
				key: "order_key",
				value: "6",
			},
		});
	}
	const setting_title = await prisma.setting.findFirst({
		where: {
			key: "title",
		},
	});
	if (!setting_title) {
		await prisma.setting.create({
			data: {
				key: "title",
				value: "nPlatform",
			},
		});
	}
	const setting_description = await prisma.setting.findFirst({
		where: {
			key: "description",
		},
	});
	if (!setting_description) {
		await prisma.setting.create({
			data: {
				key: "description",
				value: "nPlatform is a platform that provides a set of tools and services to help developers build and deploy applications quickly and efficiently.",
			},
		});
	}
	const order_permission = await prisma.setting.findFirst({
		where: {
			key: "order_permission",
		},
	});
	if (!order_permission) {
		await prisma.setting.create({
			data: {
				key: "order_permission",
				value: "[]",
			},
		});
	}

	// image
	const setting_file = await prisma.setting.findFirst({
		where: {
			key: "image",
		},
	});
	if (!setting_file) {
		await prisma.setting.create({
			data: {
				key: "image",
				value: "/imgs/logo_black.png",
			},
		});
	}
};
