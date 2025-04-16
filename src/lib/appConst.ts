import { BookOpen, FerrisWheel, File, Home, HomeIcon, Image, LayoutDashboard, Package, Settings, ShoppingCart, Store, User, Users } from "lucide-react";

export const MenuItems = [
	{
		title: "Dashboard",
		url: "/admin",
		icon: LayoutDashboard,
		role: ["USER", "ADMIN", "MODERATOR"],
	},
	{
		title: "Orders",
		url: "/admin/orders",
		icon: ShoppingCart,
		role: ["ADMIN", "MODERATOR"],
	},
	{
		title: "Products",
		url: "/admin/products",
		icon: Package,
		role: ["ADMIN", "MODERATOR"],
	},
	{
		title: "Customers",
		url: "/admin/customers",
		icon: Users,
		role: ["ADMIN"],
	},
	{
		title: "Vendors",
		url: "/admin/vendors",
		icon: Store,
		role: ["ADMIN"],
	},
	{
		title: "Files",
		url: "/admin/files",
		icon: Image,
		role: ["ADMIN", "MODERATOR"],
	},
	{
		title: "Posts",
		url: "/admin/posts",
		icon: File,
		role: ["ADMIN", "MODERATOR"],
	},
	{
		title: "Categories",
		url: "/admin/categories",
		icon: BookOpen,
		role: ["ADMIN", "MODERATOR"],
	},
	{
		title: "Attribute",
		url: "/admin/attributes",
		icon: FerrisWheel,
		role: ["ADMIN", "MODERATOR"],
	},
	{
		title: "User",
		url: "/admin/users",
		icon: User,
		role: ["ADMIN"],
	},
];

export const FooterItems = [
	{
		title: "Settings",
		url: "/admin/settings",
		icon: Settings,
		role: ["ADMIN", "MODERATOR"],
	},
	{
		title: "Back to Home",
		url: "/",
		icon: HomeIcon,
		role: ["USER", "ADMIN", "MODERATOR"],
	},
];

export const appState = {
	appName: "nPlatform",
	appVersion: "1.0.0",
	appDescription: "nPlatform continually draws and delivers new audiences to create a global network of connected best-in-class apparel decorators, manufacturers, graphic designers, and brand influencers.",
	ACCEPTED_IMG_FILE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
	ACCEPTED_VIDEO_FILE_TYPES: ["video/mp4", "video/avi", "video/mov", "video/wmv", "video/flv"],
	ACCEPTED_AUDIO_FILE_TYPES: ["audio/mp3", "audio/wav", "audio/ogg", "audio/mpeg"],
	ACCEPTED_DOC_FILE_TYPES: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/zip", "application/x-zip-compressed", "application/x-zip"],
	UPLOAD_PATH: "/public/uploads/",
	UPLOAD_DIR: "/uploads/",
	url: "https://nguyenpham.pro",
	none: "data:image/png;base64,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",
	placeholder:
		"data:image/png;base64,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",
};

export const meta = (data: any) => {
	return {
		title: data?.title || "nPlatform",
		description: data?.description || "nPlatform continually draws and delivers new audiences to create a global network of connected best-in-class apparel decorators, manufacturers, graphic designers, and brand influencers.",
		openGraph: {
			title: data?.title || "nPlatform",
			description: data?.description || "nPlatform continually draws and delivers new audiences to create a global network of connected best-in-class apparel decorators, manufacturers, graphic designers, and brand influencers.",
			images: data.openGraph?.images || [],
		},
		twitter: {
			card: "summary_large_image",
			title: data?.title || "nPlatform",
			description: data?.description || "nPlatform continually draws and delivers new audiences to create a global network of connected best-in-class apparel decorators, manufacturers, graphic designers, and brand influencers.",
			creator: "@madelab",
			images: data.openGraph?.images || [],
		},
		authors: [{ name: "Nguyen Pham", url: "https://nguyenpham.pro" }],
		icons: {
			icon: "/favicon/favicon.ico",
			shortcut: "/favicon/apple-icon.png",
			apple: "/favicon/apple-icon.png",
			other: {
				rel: "apple-touch-icon-precomposed",
				url: "/favicon/apple-touch-icon-precomposed.png",
			},
		},
		manifest: "/favicon/manifest.json",
		verification: {
			google: "**********",
			yandex: "**********",
			yahoo: "**********",
			bing: "**********",
			other: {
				me: ["support@nguyenpham.pro", "https://nguyenpham.pro"],
			},
		},
	};
};
