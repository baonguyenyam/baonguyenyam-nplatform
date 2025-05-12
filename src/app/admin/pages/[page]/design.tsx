import { useCallback, useEffect, useState } from "react";
import { Puck } from "@measured/puck";
import { toast } from "sonner";

import config from "@/components/pagebuilder/config";
import { useMetadata } from "@/components/pagebuilder/lib/use-metadata";

import * as actions from "./actions";

import "@measured/puck/puck.css";

// --- Interfaces ---
interface Category {
	id: number; // Or string, depending on your data model
	name: string;
	type?: string; // Optional: if categories are typed (e.g., 'post', 'product')
}

interface PostMeta {
	key: string;
	value: string;
}

interface PostData {
	id: string; // Or number, depending on your data model
	title: string;
	slug: string;
	content?: string;
	published?: boolean;
	image?: string; // URL of the featured image
	type?: string; // e.g., 'post', 'page'
	categories?: Category[]; // Array of associated categories
	files?: { id: string }[]; // Array of associated file objects (adjust structure as needed)
	data?: string; // JSON string potentially holding dynamic attribute data
	meta?: PostMeta[]; // Array for metadata like SEO keywords, etc.
	// Add any other relevant fields for your Post data structure
}

export default function FormDesign(props: any) {
	const type = "page";
	const { id, onChange, initialData } = props;
	const { metadata } = useMetadata();
	const params = new URL(window.location.href).searchParams;
	const [postData, setPostData] = useState<PostData | {} | null>(null);

	const fetchData = useCallback(async () => {
		const res = await actions.getRecord(id);
		if (res?.success === "success" && res?.data) {
			setPostData(res.data);
		} else {
			setPostData(null);
		}
	}, [id]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// Save the data to your database
	const save = async (data: any) => {
		const _body = {
			title: data?.root?.props?.title,
			data: JSON.stringify(data),
		};
		await actions.updateRecord(id, _body).then((res) => {
			if (res?.success === "success") {
				toast.success(res.message);
				if (onChange) {
					onChange("submit", res.data);
				}
			}
		});
	};

	return (
		<>
			<Puck
				config={config}
				data={JSON.parse(initialData?.data || "{}")}
				onPublish={save}
				iframe={{
					enabled: params.get("disableIframe") === "true" ? false : true,
				}}
				metadata={metadata}
			/>
		</>
	);
}
