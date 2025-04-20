import { Ban, CheckCheck, CircleAlert, Clock, Hourglass, MapPinCheck, TicketX, Truck } from "lucide-react";

export const enumOrderStatus = [
	{
		label: "Pending",
		value: "pending",
		className: "text-yellow-700",
		bgClassName: "bg-yellow-100",
		borderClassName: "border-yellow-700",
		icon: CircleAlert,
	},
	{
		label: "Completed",
		value: "completed",
		className: "text-green-700",
		bgClassName: "bg-green-100",
		borderClassName: "border-green-700",
		icon: CheckCheck,
	},
	{
		label: "Cancelled",
		value: "cancelled",
		className: "text-red-700",
		bgClassName: "bg-red-100",
		borderClassName: "border-red-700",
		icon: Ban,
	},
	{
		label: "Refunded",
		value: "refunded",
		className: "text-slate-700",
		bgClassName: "bg-slate-100",
		borderClassName: "border-slate-700",
		icon: TicketX,
	},
	{
		label: "Waiting",
		value: "waiting",
		className: "text-teal-700",
		bgClassName: "bg-teal-100",
		borderClassName: "border-teal-700",
		icon: Hourglass,
	},
	{
		label: "Processing",
		value: "processing",
		className: "text-blue-700",
		bgClassName: "bg-blue-100",
		borderClassName: "border-blue-700",
		icon: Clock,
	},
	{
		label: "Shipped",
		value: "shipped",
		className: "text-orange-700",
		bgClassName: "bg-orange-100",
		borderClassName: "border-orange-700",
		icon: Truck,
	},
	{
		label: "Delivered",
		value: "delivered",
		className: "text-green-700",
		bgClassName: "bg-green-100",
		borderClassName: "border-green-700",
		icon: MapPinCheck,
	},
];

export const enumPublished = [
	{
		label: "Published",
		value: "TRUE",
		className: "text-green-700",
		bgClassName: "bg-green-100",
		borderClassName: "border-green-700",
		icon: CheckCheck,
	},
	{
		label: "Unpublished",
		value: "FALSE",
		className: "text-red-700",
		bgClassName: "bg-red-100",
		borderClassName: "border-red-700",
		icon: Ban,
	},
];

export const enumType = [
	{
		label: "Product",
		value: "product",
	},
	{
		label: "Post",
		value: "post",
	},
	{
		label: "Media",
		value: "media",
	},
	{
		label: "Order",
		value: "order",
	},
	{
		label: "Page",
		value: "page",
	},
];

export const enumPermission = [
	{
		label: "Admin",
		value: "ADMIN",
		className: "text-red-700",
	},
	{
		label: "User",
		value: "USER",
		className: "",
	},
	{
		label: "Moderator",
		value: "MODERATOR",
		className: "text-blue-700",
	},
];

export const enumAttribute = [
	{
		label: "User",
		value: "user",
	},
	{
		label: "Order",
		value: "order",
	},
	{
		label: "Post",
		value: "post",
	},
];

export const enumFieldType = [
	{
		label: "Text",
		value: "text",
	},
	{
		label: "Select",
		value: "select",
	},
	{
		label: "Checkbox",
		value: "checkbox",
	},
];

export const enumOrderType = [
	{
		label: "Shipping",
		value: "shipping",
	},
	{
		label: "Payment",
		value: "payment",
	},
	{
		label: "Product",
		value: "product",
	},
	{
		label: "Package",
		value: "package",
	},
	{
		label: "Shipped",
		value: "shipped",
	},
];
